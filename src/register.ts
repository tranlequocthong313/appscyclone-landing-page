import 'animate.css'
import { RegisterSchema } from './validation'

const form = document.querySelector("#form")!

document.addEventListener('DOMContentLoaded', () => {
    for (const input of form.getElementsByTagName("input")) {
        input.addEventListener("input", () => {
            const errorMessages = input.parentElement!.querySelector(".error-messages")
            if (errorMessages) {
                input.parentElement!.classList.remove("register__input-container--invalid")
                errorMessages.remove()
            }
        })
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const target = e.target as HTMLFormElement
    const formData = new FormData(target)

    const register: Record<string, string> = {}
    for (const [k, v] of formData.entries()) {
        register[k] = v.toString()
    }

    const validation = RegisterSchema.safeParse(register)
    if (validation.error) {
        for (const [k, v] of Object.entries(validation.error.formErrors.fieldErrors)) {
            const input = document.querySelector(`input[name=${k}]`)!
            input.parentElement!.querySelector(".error-messages")?.remove()
            input.parentElement!.classList.add("register__input-container--invalid")
            const errorMessages = document.createElement('ul')
            errorMessages.classList.add('px-2.5', 'error-messages')
            errorMessages.innerHTML = v.map(message => `<li class="text-danger font-medium error-message">${message}</li>`).join('')
            input.parentElement!.appendChild(errorMessages)
        }
    } else {
        console.log("%c Registered successfully!", 'color: #00A8A4; font-weight: bold; font-size: 14px;')
        alert("Registered successfully!")
    }
})
