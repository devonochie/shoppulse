import { z } from 'zod'
import { paymentMethodSchema } from './order.validators';


export const currencySchema = z.enum(['USD', 'EUR', 'GBP', 'JPY']);


export const paymentValidator = z.object({
    order_id: z.string().min(1),
    amount: z.number().positive(),
    method: paymentMethodSchema,
    details: z.unknown().optional(), 
    status: z.enum(["pending", "completed", "failed", "refunded"]).default("pending"),
    currency: currencySchema.default("USD"),
    exchange_rate: z.number().positive().optional()
    
})

export type Payment = z.infer<typeof paymentValidator>
export type Currency = z.infer<typeof currencySchema>;