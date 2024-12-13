// Handle Navbar Menu On Small Screen Device
document.getElementById("menuToggle")!.addEventListener("click", function () {
    const menu = document.getElementById("menu")!
    menu.classList.toggle("hidden")
})


// Handle animation on scroll to
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll<HTMLElement>(".animate-on-scroll")

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const target = entry.target as HTMLElement

            if (entry.isIntersecting) {
                const animation = target.dataset.animation

                if (animation) {
                    target.classList.add("animate__animated", "animate__" + animation)
                }

                observer.unobserve(target)
            }
        })
    })

    sections.forEach((section) => observer.observe(section))
})
