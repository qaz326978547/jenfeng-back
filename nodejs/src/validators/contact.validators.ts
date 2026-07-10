import { z } from "zod";

const contactListItemSchema = z.object({
  name: z.string({ error: "請輸入姓名" }).min(1, "請輸入姓名"),
  email: z.string({ error: "請輸入信箱" }).email("信箱格式錯誤"),
  job: z.string().nullable().optional(),
  cel: z
    .string({ error: "請輸入手機" })
    .min(1, "請輸入手機")
    .max(10, "手機格式錯誤"),
});

export const createContactSchema = z.object({
  class: z.string({ error: "請輸入報名課程" }).min(1, "請輸入報名課程"),
  quest: z.string({ error: "目前想解決或想瞭解的問題" }).min(1, "目前想解決或想瞭解的問題"),
  company: z.string({ error: "請輸入公司名稱" }).min(1, "請輸入公司名稱"),
  tel: z.string({ error: "請輸入電話" }).min(1, "請輸入電話").max(10, "電話格式錯誤"),
  num: z.string({ error: "請輸入報名人數" }).min(1, "請輸入報名人數"),
  last5: z.string().max(5, "格式錯誤").nullable().optional(),
  ticket: z.enum(["2", "3"]).nullable().optional(),
  ticket_name: z.string().nullable().optional(),
  ticket_no: z.string().nullable().optional(),
  ticket_address: z.string().nullable().optional(),
  from: z.string().nullable().optional(),
  suggest_name: z.string().nullable().optional(),
  contactList: z
    .array(contactListItemSchema, { error: "請提供聯絡人列表" })
    .min(1, "請提供聯絡人列表"),
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

export const createContactClassSchema = z.object({
  name: z.string({ error: "請輸入name" }).min(1, "請輸入name"),
  no: z.coerce.number({ error: "no格式錯誤" }).int("no格式錯誤"),
});

export type CreateContactClassInput = z.infer<typeof createContactClassSchema>;
