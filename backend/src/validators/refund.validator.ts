import z from "zod";


const idSchema = z.string().min(1, "ID is required");

export const refundValidator = z.object({
    order_id: idSchema.optional(),
    reason: z.string().min(10),
    amount: z.number().positive(),
    status: z.enum(["requested", "processed", "rejected"])
});

export type Refund = z.infer<typeof refundValidator>