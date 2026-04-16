'use server';
/**
 * @fileOverview This file implements a Genkit flow for providing proactive financial insights and warnings.
 *
 * - proactiveFinancialInsights - A function that analyzes financial performance and provides insights, warnings, and recommendations.
 * - ProactiveFinancialInsightsInput - The input type for the proactiveFinancialInsights function.
 * - ProactiveFinancialInsightsOutput - The return type for the proactiveFinancialInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProactiveFinancialInsightsInputSchema = z.object({
  currentDate: z.string().describe('The current date in YYYY-MM-DD format.'),
  recentSales: z.number().describe('Total sales amount for the recent period.'),
  recentExpenses: z.number().describe('Total expenses amount for the recent period.'),
  recentProfitChange: z.string().describe('Description of profit change, e.g., "increased by 10%", "decreased by 5%", "remained stable".'),
  recentPeriod: z.string().describe('The period for recent sales/expenses, e.g., "last week", "last month".'),
  outstandingClientDebts: z.array(z.object({
    clientName: z.string().describe('Name of the client.'),
    amount: z.number().describe('Amount of debt.'),
    dueDate: z.string().optional().describe('Optional due date for the debt in YYYY-MM-DD format.'),
  })).describe('List of outstanding debts from clients.'),
  upcomingBusinessPayments: z.array(z.object({
    description: z.string().describe('Description of the payment.'),
    amount: z.number().describe('Amount of the payment.'),
    dueDate: z.string().describe('Due date for the payment in YYYY-MM-DD format.'),
  })).describe('List of upcoming business payments.'),
  language: z.enum(['ru', 'uz', 'en']).default('ru').describe('The desired output language (Russian, Uzbek, or English).'),
});
export type ProactiveFinancialInsightsInput = z.infer<typeof ProactiveFinancialInsightsInputSchema>;

const ProactiveFinancialInsightsOutputSchema = z.object({
  insights: z.array(z.string()).describe('General financial insights based on performance.'),
  warnings: z.array(z.string()).describe('Specific warnings about potential financial issues, e.g., declining sales, overdue debts.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations to improve financial health or address issues.'),
});
export type ProactiveFinancialInsightsOutput = z.infer<typeof ProactiveFinancialInsightsOutputSchema>;

const proactiveFinancialInsightsPrompt = ai.definePrompt({
  name: 'proactiveFinancialInsightsPrompt',
  input: { schema: ProactiveFinancialInsightsInputSchema },
  output: { schema: ProactiveFinancialInsightsOutputSchema },
  prompt: `You are a helpful financial assistant for a small to medium business owner in Uzbekistan. Your goal is to proactively analyze their financial performance and provide timely insights, warnings, and actionable recommendations in {{language}}. Respond in JSON format according to the output schema.

Today's Date: {{{currentDate}}}

Recent Financial Performance ({{recentPeriod}}):
- Total Sales: {{{recentSales}}}
- Total Expenses: {{{recentExpenses}}}
- Profit Trend: Profit has {{{recentProfitChange}}} {{recentPeriod}}.

Outstanding Client Debts:
{{#if outstandingClientDebts}}
{{#each outstandingClientDebts}}
- Client: {{{clientName}}}, Amount: {{{amount}}}, Due Date: {{#if dueDate}}{{{dueDate}}}{{else}}N/A{{/if}}
{{/each}}
{{else}}
No outstanding client debts.
{{/if}}

Upcoming Business Payments:
{{#if upcomingBusinessPayments}}
{{#each upcomingBusinessPayments}}
- Description: {{{description}}}, Amount: {{{amount}}}, Due Date: {{{dueDate}}}
{{/each}}
{{else}}
No upcoming business payments.
{{/if}}

Based on the provided data, generate financial insights, warnings, and recommendations. All outputs must be in {{language}}.

Guidelines for output:
- **Insights**: General observations about financial health or trends.
- **Warnings**: Highlight potential problems that require immediate attention (e.g., significant sales decline, very near due debts/payments).
- **Recommendations**: Provide specific, actionable advice.
- Be concise and direct. Use appropriate financial terminology.
- Consider the context of a small business in Uzbekistan.

Example for an overdue debt warning (if applicable):
- "Долг клиента {{clientName}} на сумму {{amount}} сум просрочен с {{dueDate}}."

Example for a sales decline warning (if applicable):
- "Продажи {{{recentPeriod}}} снизились на [процент]%." (e.g., "Продажи на прошлой неделе снизились на 15%.")`,
});

const proactiveFinancialInsightsFlow = ai.defineFlow(
  {
    name: 'proactiveFinancialInsightsFlow',
    inputSchema: ProactiveFinancialInsightsInputSchema,
    outputSchema: ProactiveFinancialInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await proactiveFinancialInsightsPrompt(input);
    return output!;
  }
);

export async function proactiveFinancialInsights(input: ProactiveFinancialInsightsInput): Promise<ProactiveFinancialInsightsOutput> {
  return proactiveFinancialInsightsFlow(input);
}
