import { z } from "zod";

// กฎรหัสผ่านใหม่ (ใช้ซ้ำได้)
const passwordRule = z
    .string()
    .min(8, "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัว")
    .regex(/[A-Z]/, "รหัสผ่านใหม่ต้องมีตัวพิมพ์ใหญ่")
    .regex(/[a-z]/, "รหัสผ่านใหม่ต้องมีตัวพิมพ์เล็ก")
    .regex(/[0-9]/, "รหัสผ่านใหม่ต้องมีตัวเลข");

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "กรุณากรอกรหัสผ่านเดิม"),

        newPassword: passwordRule,

        confirmNewPassword: z
            .string()
            .min(1, "กรุณายืนยันรหัสผ่านใหม่"),
    })
    // เช็กรหัสใหม่กับยืนยัน
    .refine(
        (data) => data.newPassword === data.confirmNewPassword,
        {
            message: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน",
            path: ["confirmNewPassword"],
        }
    )
    // ห้ามใช้รหัสเดิมซ้ำ
    .refine(
        (data) => data.currentPassword !== data.newPassword,
        {
            message: "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม",
            path: ["newPassword"],
        }
    );

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
