import 'animate.css'

import http, { API_ENDPOINTS } from './api'
import { Course, Evaluation } from './type'


const courseComingUp = document.querySelector("#course-coming-up")!
const courseList = document.querySelector("#course-list")!
const evaluationElement = document.querySelector("#evaluation")!
const faqItems = document.querySelectorAll(".faq-item")


// Handle Navbar Menu On Small Screen Device
document.getElementById("menuToggle")!.addEventListener("click", function () {
  const menu = document.getElementById("menu")!
  menu.classList.toggle("hidden")
})


// Handle Coming Course & All Courses Section
document.addEventListener("DOMContentLoaded", async () => {
  const courses = await fetchCourses()
  renderCourse(courses[0])
  renderCourses(courses.slice(0, 4))
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

function renderCourse(course: Course) {
  const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

  const element = `
            <div
              class="flex items-center justify-center relative w-full px-2.5"
            >
              <img
                src="${course.image}"
                class="w-[427px] h-[427px] relative -left-24 animate-on-scroll hidden md:block"
                data-animation="zoomIn"
                alt="${course.name}"
              />
              <div
                class="flex flex-col w-full gap-20 animate__animated animate__fadeInUp animate__delay-1s"
              >
                <div class="flex flex-col gap-10">
                  <div class="flex flex-col gap-4">
                    <div class="gap-1 flex flex-col">
                      <p class="text-textSecondary">${course.type}</p>
                      <h5 class="text-h4 font-medium">${course.name}</h5>
                    </div>
                    <div class="flex items-center gap-2">
                      <img src="${teacher.avatar}" alt="avatar" class="rounded-full w-10 h-10" />
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
                <div class="flex gap-4 flex-col md:flex-row">
                  <button
                    class="bg-tertiaryBackground text-white rounded-[40px] py-4 px-10 font-bold hover:bg-primaryMain animate__animated animate__fadeInUp animate__delay-2s transition-transform duration-300 ease-in-out"
                  >
                    Register for school
                  </button>
                  <button
                    class="bg-transparent text-textPrimary rounded-[40px] py-4 px-6 w-full md:w-[220px] border border-tertiaryBackground font-bold hover:border-primaryMain hover:text-primaryMain animate__animated animate__fadeInUp animate__delay-2s transition-transform duration-300 ease-in-out"
                  >
                    <a class="block w-full h-full" href="/src/pages/course-details?id=${course.id}">
                      See details
                    </a>
                  </button>
                </div>
              </div>
            </div>
          `

  courseComingUp.innerHTML += element
}

function renderCourses(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `
          <div
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer"
            data-animation="fadeIn"
          >
            <a href="/src/pages/course-details?id=${course.id}">
              <img src="${course.image}" alt="${course.name}" />
              <div
                class="absolute top-10 right-10 bg-primaryMain px-4 py-2 text-white"
              >
                ${course.learningForm}
              </div>
              <div class="p-10 flex flex-col gap-4 bg-secondaryBackground">
                <div class="flex flex-col gap-2">
                  <p class="text-sm leading-6 text-textSecondary">${course.type}</p>
                  <h5 class="text-textPrimary text-2xl leading-9 font-bold">
                    ${course.name}
                  </h5>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img src="${teacher.avatar}" alt="${teacher.name}" class="w-10 h-10 rounded-full" />
                    <span>${teacher.name}</span>
                  </div>
                  <span class="text-textPrimary font-bold text-xl"
                    >${course.price}đ</span
                  >
                </div>
              </div>
            </a>
          </div>
      `

    courseList.innerHTML += element
  }
}


async function fetchEvaluations() {
  try {
    const response = await http.get(API_ENDPOINTS.evaluations)
    return response.data
  } catch (error) {
    console.error('Error fetching evaluation:', error)
    return []
  }
}

function renderEvaluation(evaluation: Evaluation) {
  const element = `
          <img
            src="src/assets/images/quote.png"
            class="w-8 h-6 mb-10 -scale-x-100"
            alt="quote"
          />
          <p class="text-textSecondary text-lg mb-14">
            ${evaluation.content}
          </p>
          <div class="flex items-center gap-2">
            <img
              src="${evaluation.author.avatar}"
              alt="avatar"
              class="rounded-full"
            />
            <div class="flex flex-col gap-1">
              <h6 class="text-lg font-bold">${evaluation.author.name}</h6>
              <p class="text-textSecondary">${evaluation.author.badge}</p>
            </div>
          </div>
  `
  evaluationElement.innerHTML += element
}

// Evaluation
document.addEventListener("DOMContentLoaded", async () => {
  const evaluations = await fetchEvaluations()
  renderEvaluation(evaluations[0])
})


// Handle FAQ Section
document.addEventListener("DOMContentLoaded", () => {
  for (const faqItem of faqItems) {
    faqItem.addEventListener("click", () => {
      const isOpen = !faqItem.getElementsByTagName("p")[0].classList.contains("hidden")
      if (isOpen) {
        faqItem.classList.remove("bg-secondaryBackground")
        faqItem.getElementsByTagName("img")[0].classList.add("hidden")
        faqItem.getElementsByTagName("img")[1].classList.remove("hidden")
        faqItem.getElementsByTagName("p")[0].classList.add("hidden")
      } else {
        faqItem.classList.add("bg-secondaryBackground")
        faqItem.getElementsByTagName("img")[0].classList.remove("hidden")
        faqItem.getElementsByTagName("img")[1].classList.add("hidden")
        faqItem.getElementsByTagName("p")[0].classList.remove("hidden")
      }
    })
  }
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
