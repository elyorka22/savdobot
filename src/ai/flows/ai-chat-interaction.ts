'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI chat assistant.
 * It processes natural language commands (Russian/Uzbek) to manage sales, expenses,
 * debts, and financial queries, outputting a structured JSON object representing the action.
 *
 * - aiChatInteraction - The main function to interact with the AI assistant.
 * - AiChatInteractionInput - The input type for the aiChatInteraction function.
 * - AiChatInteractionOutput - The return type for the aiChatInteraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatInteractionInputSchema = z.object({
  message: z.string().describe('The user\'s chat message in Russian or Uzbek, containing a command or query.'),
});
export type AiChatInteractionInput = z.infer<typeof AiChatInteractionInputSchema>;

const AiChatInteractionOutputSchema = z.object({
  action: z.enum([
    'recordSale',
    'recordExpense',
    'recordDebt',
    'queryFinancialData',
    'unknown'
  ]).describe('The type of action to perform based on the user\'s message. Use "unknown" if the intent is unclear.'),

  // Details for recording a sale. Present only if action is "recordSale".
  sale: z.object({
    amount: z.number().describe('The amount of the sale in Uzbek Sum (UZS).'),
    description: z.string().optional().describe('An optional description for the sale, e.g., product/service name.'),
  }).optional().describe('Details for recording a sale.'),

  // Details for recording an expense. Present only if action is "recordExpense".
  expense: z.object({
    amount: z.number().describe('The amount of the expense in Uzbek Sum (UZS).'),
    description: z.string().describe('A description for the expense (e.g., "закупка", "rent").'),
  }).optional().describe('Details for recording an expense.'),

  // Details for recording a debt. Present only if action is "recordDebt".
  debt: z.object({
    clientName: z.string().describe('The name of the client.'),
    amount: z.number().describe('The amount of the debt in Uzbek Sum (UZS).'),
    description: z.string().optional().describe('An optional description for the debt.'),
    direction: z.enum(['owedToUser', 'owedByUser']).describe('Indicates who owes whom. "owedToUser" if the client owes the user, "owedByUser" if the user owes the client. Assume "owedToUser" if not explicitly stated otherwise (e.g., "У меня есть долг у клиента Азиз").'),
  }).optional().describe('Details for recording a debt.'),

  // Details for querying financial data. Present only if action is "queryFinancialData".
  query: z.object({
    dataType: z.enum(['profit', 'earnings', 'sales', 'expenses', 'debts', 'all']).describe('The type of financial data to query.'),
    period: z.enum(['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_year', 'custom']).describe('The period for the query.'),
    startDate: z.string().optional().describe('Start date for a custom query period in YYYY-MM-DD format (e.g., 2023-01-01). Required if period is "custom".'),
    endDate: z.string().optional().describe('End date for a custom query period in YYYY-MM-DD format (e.g., 2023-01-31). Required if period is "custom".'),
  }).optional().describe('Details for querying financial data.'),

  // If the action is "unknown" or more information is needed, provide a clarifying message to the user.
  clarification: z.string().optional().describe('A clarifying message to the user in Russian or Uzbek, if the intent is unclear or more information is needed. For example: "Пожалуйста, уточните, что вы хотите сделать."'),
});
export type AiChatInteractionOutput = z.infer<typeof AiChatInteractionOutputSchema>;

export async function aiChatInteraction(input: AiChatInteractionInput): Promise<AiChatInteractionOutput> {
  return aiChatInteractionFlow(input);
}

const aiChatInteractionPrompt = ai.definePrompt({
  name: 'aiChatInteractionPrompt',
  input: { schema: AiChatInteractionInputSchema },
  output: { schema: AiChatInteractionOutputSchema },
  prompt: `You are an intelligent AI assistant for a Point of Sale (POS) system called SavdoBot. Your main goal is to understand user commands in Russian or Uzbek and convert them into a structured JSON object according to the provided schema.

The user's message will be related to managing financial transactions, debts, or querying financial data for their small to medium-sized business in Uzbekistan.

Here are the rules you must follow:
1.  **Language Comprehension**: Understand commands in both Russian and Uzbek.
2.  **Action Identification**: Determine the primary 'action' based on the user's message. Possible actions are 'recordSale', 'recordExpense', 'recordDebt', 'queryFinancialData', or 'unknown' if the intent is unclear.
3.  **Data Extraction**: For the identified action, extract all relevant details and populate the corresponding nested object (e.g., 'sale', 'expense', 'debt', 'query') in the JSON output. All amounts are in Uzbek Sum (UZS).
4.  **Debt Direction**: If the user says something like "У меня есть долг у клиента Азиз 100 000 сум" or "Клиент Азиз должен 100 000 сум", set 'debt.direction' to 'owedToUser'. If the user says "Я должен клиенту Азиз 100 000 сум", set 'debt.direction' to 'owedByUser'.
5.  **Query Period**: For queries, correctly identify the 'period' (e.g., 'today', 'this_week', 'this_month'). If a specific date range is provided (e.g., "с 1 января по 5 февраля"), set 'period' to 'custom' and extract 'startDate' and 'endDate' in YYYY-MM-DD format.
6.  **Unknown Intent**: If the user's command is ambiguous, incomplete, or cannot be mapped to any defined action, set the 'action' to 'unknown' and provide a 'clarification' message in Russian or Uzbek asking the user to provide more details.
7.  **JSON Format**: Your response MUST be a JSON object that strictly adheres to the provided schema.

User Message: {{{message}}}

Strictly follow the output schema provided.`,
});

const aiChatInteractionFlow = ai.defineFlow(
  {
    name: 'aiChatInteractionFlow',
    inputSchema: AiChatInteractionInputSchema,
    outputSchema: AiChatInteractionOutputSchema,
  },
  async (input) => {
    const { output } = await aiChatInteractionPrompt(input);
    return output!;
  }
);
