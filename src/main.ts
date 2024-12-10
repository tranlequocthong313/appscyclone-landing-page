import 'animate.css'
import http, { API_ENDPOINTS } from './api'

import { Course } from './type'


document.addEventListener("DOMContentLoaded", async () => {
  const courses = await fetchCourses()
  renderCourses(courses)
})

async function fetchCourses() {
  try {
    const response = await http.get<Course[]>(API_ENDPOINTS.courses)
    return response.data
  } catch (error) {
    console.log("Error fetching courses: ", error)
    return []
  }
}

function renderCourses(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `<div class="flex items-center justify-center relative swiper-slide">
              <img
                src="${course.image}"
                class="w-[427px] h-[427px] relative -left-24 animate-on-scroll"
                data-animation="zoomIn"
              />
              <div
                class="flex flex-col gap-20 animate__animated animate__fadeInUp animate__delay-1s"
              >
                <div class="flex flex-col gap-10">
                  <div class="flex flex-col gap-4">
                    <div class="gap-1 flex flex-col">
                      <p class="text-textSecondary">${course.type}</p>
                      <h5 class="text-h4 font-medium">${course.name}</h5>
                    </div>
                    <div class="flex items-center gap-2">
                      <img src="${teacher.avatar}" />
                      <p class="text-textSecondary">${teacher.name}</p>
                    </div>
                  </div>
                  <div class="flex gap-14">
                    <div class="flex flex-col gap-4">
                      <p class="text-textSecondary">Opening day</p>
                      <h5 class="text-h5 font-bold">${course.schedule.openingDay}</h5>
                    </div>
                    <div class="flex flex-col gap-4">
                      <p class="text-textSecondary">Learning form</p>
                      <h5 class="text-h5 font-bold">${course.learningForm}</h5>
                    </div>
                  </div>
                </div>
                <div class="flex gap-4">
                  <button
                    class="bg-tertiaryBackground text-white rounded-[40px] py-4 px-10 font-bold hover:bg-primaryMain animate__animated animate__fadeInUp animate__delay-2s transition-transform duration-300 ease-in-out"
                  >
                    Register for school
                  </button>
                  <button
                    class="bg-transparent text-textPrimary rounded-[40px] py-4 px-6 w-[220px] border border-tertiaryBackground font-bold hover:border-primaryMain hover:text-primaryMain animate__animated animate__fadeInUp animate__delay-2s transition-transform duration-300 ease-in-out"
                  >
                    See details
                  </button>
                </div>
              </div>
            </div>`
  }
}

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

document.getElementById("menuToggle")!.addEventListener("click", function () {
  const menu = document.getElementById("menu")!
  menu.classList.toggle("hidden")
})
