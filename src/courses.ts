import 'animate.css'

import http, { API_ENDPOINTS } from './api'
import { Course } from './type'


const courseList = document.querySelector("#courses")!
const filterItems = document.querySelectorAll(".filter-item")!
const totalItem = document.querySelectorAll("#total-items")!
const paginationList = document.querySelectorAll("#pagination-list")!


// Handle Navbar Menu On Small Screen Device
document.getElementById("menuToggle")!.addEventListener("click", function () {
  const menu = document.getElementById("menu")!
  menu.classList.toggle("hidden")
})


// Handle Course Filter
document.addEventListener("DOMContentLoaded", () => {
  const type = (new URLSearchParams(window.location.search)).get("type") || "All"
  for (const filterItem of filterItems) {
    if (filterItem.innerHTML.includes(type)) {
      filterItem.classList.add("text-white", "bg-tertiaryBackground")
    } else {
      filterItem.classList.remove("text-white", "bg-tertiaryBackground")
    }
  }
})


// Handle Coming Course & All Courses Section
document.addEventListener("DOMContentLoaded", async () => {
  const courses = await fetchCourses()
  renderCourses(courses)
})

async function fetchCourses() {
  try {
    const query = new URLSearchParams(window.location.search)
    const type = query.get("type") || ""
    const page = query.get("page") || "1"
    const perPage = query.get("limit") || "9"
    const response = await http.get<Course[]>(API_ENDPOINTS.courses + "?type=" + type)
    return response.data
  } catch (error) {
    console.log("Error fetching courses: ", error)
    return []
  }
}


function renderCourses(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `<div
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer"
            data-animation="fadeIn"
          >
            <img src="${course.image}" alt="${course.name}" class="w-[427px] h-[427px]" />
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
                  <img src="${teacher.avatar}" alt="${teacher.name}" />
                  <span>${teacher.name}</span>
                </div>
                <span class="text-textPrimary font-bold text-xl"
                  >${course.price}</span
                >
              </div>
            </div>
          </div>`

    courseList.innerHTML += element
  }
}


// Handle Course Pagination


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
