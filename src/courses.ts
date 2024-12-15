import 'animate.css'

import http, { API_ENDPOINTS } from './api'
import { Course } from './type'

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 9

const courseList = document.querySelector("#courses")!
const filterItems = document.querySelectorAll(".filter-item")!
const totalItem = document.querySelector("#total-items")!
const paginationSection = document.querySelector("#pagination-section")!
const paginationList = document.querySelector("#pagination-list")!
const noDataFoundImage = document.querySelector("#no-data-found-img")!


// Handle Courses, Filter and Pagination Section
document.addEventListener("DOMContentLoaded", () => {
  let set = false
  for (const filterItem of filterItems) {
    if (!set) {
      filterItem
      filterItem.classList.add('filter-item--active')
      set = true
      handleCourses()
    }
    filterItem.addEventListener('click', async () => {
      document.querySelector('.filter-item--active')!.classList.remove('filter-item--active')
      filterItem.classList.add('filter-item--active')
      await handleCourses()
    })
  }
})

async function handleCourses(page: number = 1) {
  renderSkeletonCourses()
  const { data: courses, total = 0 } = await fetchCourses(page)
  if (courses.length > 0) {
    courseList.classList.remove('hidden')
    noDataFoundImage.classList.add('hidden')
    noDataFoundImage.classList.remove('flex')
    paginationSection.classList.remove('hidden')
    renderCourses(courses)
    totalItem.innerHTML = String(total)
    renderPagination(Math.ceil(total / DEFAULT_LIMIT))
  } else {
    courseList.classList.add('hidden')
    noDataFoundImage.classList.remove('hidden')
    noDataFoundImage.classList.add('flex')
    paginationSection.classList.add('hidden')
  }
}

function renderPagination(totalPages: number, maxVisiblePages: number = 6) {
  const currentPage = parseInt(paginationList.querySelector('.pagination-item--active')?.getAttribute('data-page') || String(DEFAULT_PAGE))

  paginationList.innerHTML = ''

  const prev = document.createElement('li')
  if (currentPage === 1) {
    prev.classList.add("opacity-50", "pointer-events-none", "hover:bg-primaryMain")
  }
  prev.classList.add('bg-secondaryBackground', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'cursor-pointer')
  prev.innerHTML = `
        <img src="/src/assets/icons/arrow-left-back.png" alt="arrow left" />
  `
  prev.addEventListener('click', () => {
    if (currentPage > 1) {
      const el = paginationList.querySelector('.pagination-item--active')
      el?.classList.remove('pagination-item--active')
      el?.previousElementSibling?.classList.add('pagination-item--active')
      handleCourses(currentPage - 1)
    }
  })
  paginationList.appendChild(prev)

  const pages: (number | string)[] = []

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    const halfRange = Math.floor(maxVisiblePages / 2)
    const isGreaterThanHalf = currentPage > (halfRange + 2)
    if (isGreaterThanHalf) {
      pages.push("...")
    }
    const start = Math.max(2, currentPage - halfRange)
    const end = Math.min(totalPages - 1, currentPage + halfRange)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - halfRange - 1) {
      pages.push("...")
    }
    pages.push(totalPages)
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
      const li = document.createElement('li')
      if (page === currentPage) {
        li.classList.add('pagination-item--active')
      }
      li.classList.add('pagination-item')
      li.setAttribute('data-page', String(page))
      li.addEventListener('click', () => {
        document.querySelector('.pagination-item--active')?.classList.remove('pagination-item--active')
        li.classList.add('pagination-item--active')
        const page = li.getAttribute('data-page')
        if (page) {
          handleCourses(Number(page))
        }
      })
      li.textContent = String(page)
      paginationList.appendChild(li)
    }
  }

  const next = document.createElement('li')
  if (currentPage === totalPages) {
    next.classList.add("opacity-50", "pointer-events-none", "hover:bg-primaryMain")
  }
  next.classList.add('bg-secondaryBackground', 'w-10', 'h-10', 'flex', 'items-center', 'justify-center', 'cursor-pointer')
  next.innerHTML = `
        <img src="/src/assets/icons/arrow-right.png" alt="arrow right" />
  `
  next.addEventListener('click', () => {
    if (currentPage < totalPages) {
      const el = paginationList.querySelector('.pagination-item--active')
      el?.classList.remove('pagination-item--active')
      el?.nextElementSibling?.classList.add('pagination-item--active')
      handleCourses(currentPage + 1)
    }
  })
  paginationList.appendChild(next)
}

async function fetchCourses(page: number = DEFAULT_PAGE) {
  try {
    const query = new URLSearchParams(window.location.search)
    let type = document.querySelector('.filter-item--active')?.getAttribute('data-type')
    if (type === 'All') {
      type = ''
    }
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

function renderSkeletonCourses() {
  courseList.innerHTML = ''
  for (let i = 0; i < 9; i++) {
    const element = `<li
            class="relative animate-on-scroll cursor-pointer"
            data-animation="fadeIn"
          >
            <img class="w-[427px] h-[427px] skeleton" />
            <div class="p-10 flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text">
                </div>
              </div>
              <div class="flex justify-between items-center gap-2">
                <img class="w-10 h-10 rounded-full skeleton" />
                <div class="skeleton skeleton-text"></span>
              </div>
            </div>
          </li>`

    courseList.innerHTML += element
  }
}


function renderCourses(courses: Course[]) {
  courseList.innerHTML = ''

  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `<li
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer"
            data-animation="fadeIn"
          >
            <a href="/src/pages/course-details.html?id=${course.id}">
              <img src="${course.image}" alt="${course.name}" class="md:max-w-[427px] md:max-h-[427px]" />
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
          </li>`

    courseList.innerHTML += element
  }
}
