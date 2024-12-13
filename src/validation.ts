import { z } from 'zod'

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must contain at least 2 characters").max(50, "Name can have a maximum of 50 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, "Invalid phone number"),
    'learning-form': z.enum(["offline", "online"], { message: "Learning mode must be either Online or Offline" }).default("offline"),
    'fb-url': z.string().regex(/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/, "Invalid Facebook URL"),
    opinion: z.string().optional(),
})

export type Register = z.infer<typeof RegisterSchema>

export {
    RegisterSchema
}
