import { z } from "zod";

// Sale validation schemas
export const saleCreateSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
});

export const saleUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").max(255, "Description too long").optional(),
});

// Expense validation schemas
export const expenseCreateSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required").max(255, "Description too long"),
});

export const expenseUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  description: z.string().min(1, "Description is required").max(255, "Description too long").optional(),
});

// Client validation schemas
export const clientCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone format").max(20, "Phone number too long").optional(),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  phone: z.string().regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone format").max(20, "Phone number too long").optional(),
});

// Debt validation schemas
export const debtCreateSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientName: z.string().min(1, "Client name is required").max(100, "Client name too long"),
  amount: z.number().positive("Amount must be positive"),
  direction: z.enum(["owedToUser", "owedByUser"], {
    errorMap: () => ({ message: "Direction must be either 'owedToUser' or 'owedByUser'" }),
  }),
  description: z.string().max(255, "Description too long").optional(),
  dueDate: z.string().datetime("Invalid due date format").optional(),
});

export const debtUpdateSchema = z.object({
  amount: z.number().positive("Amount must be positive").optional(),
  direction: z.enum(["owedToUser", "owedByUser"]).optional(),
  description: z.string().max(255, "Description too long").optional(),
  dueDate: z.string().datetime("Invalid due date format").optional(),
  status: z.enum(["active", "paid"]).optional(),
});

export const debtPaySchema = z.object({
  amount: z.number().positive("Payment amount must be positive"),
});

// Reminder validation schemas
export const reminderCreateSchema = z.object({
  text: z.string().min(1, "Reminder text is required").max(500, "Text too long"),
  eventAt: z.string().datetime("Invalid event date format"),
  remindAt: z.string().datetime("Invalid reminder date format"),
});

export const reminderUpdateSchema = z.object({
  text: z.string().min(1, "Reminder text is required").max(500, "Text too long").optional(),
  eventAt: z.string().datetime("Invalid event date format").optional(),
  remindAt: z.string().datetime("Invalid reminder date format").optional(),
  status: z.enum(["active", "done"]).optional(),
  notified: z.boolean().optional(),
});

// Web Push subscription schema
export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url("Invalid endpoint URL"),
  keys: z.object({
    p256dh: z.string().min(1, "p256dh key is required"),
    auth: z.string().min(1, "auth key is required"),
  }),
});

// API response schemas
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    code: z.string().optional(),
  });
}

export const apiResponseSchema = createApiResponseSchema(z.unknown());

export type ApiResponse = z.infer<typeof apiResponseSchema>;

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().int().positive().default(1)),
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100).default(20)),
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime("Invalid start date").optional(),
  endDate: z.string().datetime("Invalid end date").optional(),
});

// Type exports
export type SaleCreate = z.infer<typeof saleCreateSchema>;
export type SaleUpdate = z.infer<typeof saleUpdateSchema>;
export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;
export type ClientCreate = z.infer<typeof clientCreateSchema>;
export type ClientUpdate = z.infer<typeof clientUpdateSchema>;
export type DebtCreate = z.infer<typeof debtCreateSchema>;
export type DebtUpdate = z.infer<typeof debtUpdateSchema>;
export type DebtPay = z.infer<typeof debtPaySchema>;
export type ReminderCreate = z.infer<typeof reminderCreateSchema>;
export type ReminderUpdate = z.infer<typeof reminderUpdateSchema>;
export type PushSubscription = z.infer<typeof pushSubscriptionSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type DateRange = z.infer<typeof dateRangeSchema>;
