import { z } from 'zod'

const RegisterSchema = z.object({
    name: z.string().min(2, "Tên phải chứa it nhất 2 ký tự").max(50, "Tên chứa tối đa 50 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().regex(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, "Số  điện hoại không hợp lệ"),
    'learning-form': z.enum(["offline", "online"], { message: "Hình thức học chỉ có thể là Online hoặc Offline" }).default("offline"),
    'fb-url': z.string().regex(/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/, "Đường dẫn Facebook không hợp lệ"),
    opinion: z.string().optional(),
})

export type Register = z.infer<typeof RegisterSchema>

export {
    RegisterSchema
}
