import 'animate.css'

import http, { API_ENDPOINTS } from './api'
import { Course } from './type'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 9

const courseList = document.querySelector("#courses")!
const filterItems = document.querySelectorAll(".filter-item")!
const totalItem = document.querySelector("#total-items")!
const paginationList = document.querySelector("#pagination-list")!


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


// Handle Courses and Pagination Section
document.addEventListener("DOMContentLoaded", async () => {
  const { data: courses, total = 0 } = await fetchCourses()
  if (courses) {
    renderCourses(courses)
  }
  totalItem.innerHTML += total
  renderPagination(Math.ceil(total / DEFAULT_LIMIT))
})

function renderPagination(size: number, maxVisiblePages: number = 6) {
  const query = new URLSearchParams(window.location.search)
  const currentPage = parseInt(query.get("page") || String(DEFAULT_PAGE))

  paginationList.innerHTML += `
    <li
      class="bg-secondaryBackground w-10 h-10 flex items-center justify-center ${currentPage === 1 ? "opacity-50 pointer-events-none" : ""
    }"
    >
      <a class="flex items-center justify-center w-full h-full hover:bg-primaryMain" href="?page=${currentPage - 1}">
        <img src="/src/assets/icons/arrow-left-back.png" alt="arrow left" />
      </a>
    </li>
  `

  const pages: (number | string)[] = []

  if (size <= maxVisiblePages) {
    for (let i = 1; i <= size; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    const halfRange = Math.floor(maxVisiblePages / 2)
    const isOnHalf = currentPage > (halfRange + 2)
    if (isOnHalf) {
      pages.push("...")
    }
    const start = Math.max(2, currentPage - halfRange)
    const end = Math.min(size - 1, currentPage + halfRange)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < size - halfRange - 1) {
      pages.push("...")
    }
    pages.push(size)
  }

  for (let page of pages) {
    if (page === '...') {
      paginationList.innerHTML += `
          <li
            class="bg-secondaryBackground text-textPrimary w-10 h-10 text-center leading-10"
          >
            ...
          </li>
      `
    } else {
      paginationList.innerHTML += `
        <li
          class="${page === currentPage
          ? "bg-primaryMain text-white"
          : "bg-secondaryBackground text-textPrimary"
        } w-10 h-10 text-center leading-10 hover:bg-primaryMain hover:text-white"
        >
          <a class="block w-full h-full" href="?page=${page}" class="no-underline">${page}</a>
        </li>
      `
    }
  }

  paginationList.innerHTML += `
    <li
      class="bg-secondaryBackground w-10 h-10 flex items-center justify-center ${currentPage === size ? "opacity-50 pointer-events-none" : ""
    }"
    >
      <a class="flex items-center justify-center w-full h-full hover:bg-primaryMain" href="?page=${currentPage + 1}">
        <img src="/src/assets/icons/arrow-right.png" alt="arrow right" />
      </a>
    </li>
  `
}

async function fetchCourses() {
  try {
    const query = new URLSearchParams(window.location.search)
    const type = query.get("type") || ""
    const page = parseInt(query.get("page") || DEFAULT_PAGE.toString(), 10)
    const perPage = parseInt(query.get("limit") || DEFAULT_LIMIT.toString(), 10)

    const response = await http.get<Course[]>(API_ENDPOINTS.courses)

    if (!response.data) {
      return { data: [], total: 0 }
    }

    const filteredData = type
      ? response.data.filter((course) => course.type === type)
      : response.data

    const total = filteredData.length

    const paginatedData = filteredData.slice((page - 1) * perPage, page * perPage)

    return { data: paginatedData, total }
  } catch (error) {
    console.error("Error fetching courses: ", error)
    return { data: [], total: 0 }
  }
}


function renderCourses(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `<div
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer"
            data-animation="fadeIn"
          >
            <a href="/src/pages/course-details.html?id=${course.id}">
              <img src="${course.image}" alt="${course.name}" class="md:w-[427px] md:h-[427px]" />
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
          </div>`

    courseList.innerHTML += element
  }
}


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
