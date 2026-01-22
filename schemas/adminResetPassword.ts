// schemas/adminResetPassword.ts
import { z } from "zod";

export const adminResetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัว")
            .regex(/[A-Z]/, "ต้องมีตัวพิมพ์ใหญ่")
            .regex(/[a-z]/, "ต้องมีตัวพิมพ์เล็ก")
            .regex(/[0-9]/, "ต้องมีตัวเลข"),

        confirmNewPassword: z.string(),
    })
    .refine(
        (data) => data.newPassword === data.confirmNewPassword,
        {
            message: "รหัสผ่านไม่ตรงกัน",
            path: ["confirmNewPassword"],
        }
    );

export type AdminResetPasswordInput =
    z.infer<typeof adminResetPasswordSchema>;
