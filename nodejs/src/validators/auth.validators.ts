import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string({ error: "請輸入姓名" }).min(1, "請輸入姓名"),
    email: z.string({ error: "請輸入信箱" }).email("信箱格式錯誤"),
    password: z.string({ error: "請輸入密碼" }).min(6, "密碼至少6個字元"),
    password_confirmation: z.string().optional(),
    // Note: is_admin is intentionally NOT accepted here. The original
    // Laravel register() let the client set is_admin directly on itself —
    // a privilege-escalation bug fixed in this rewrite. New accounts are
    // always created with isAdmin=false; promoting to admin requires a
    // direct database update.
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "密碼不一致",
    path: ["password_confirmation"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string({ error: "請輸入信箱" }).email("信箱格式錯誤"),
  password: z.string({ error: "請輸入密碼" }).min(1, "請輸入密碼"),
});

export type LoginInput = z.infer<typeof loginSchema>;
