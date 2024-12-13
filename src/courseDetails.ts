import 'animate.css'
import 'swiper/css'

import http, { API_ENDPOINTS } from './api'
import { Course } from './type'
import Swiper from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'

const faqItems = document.querySelectorAll(".faq-item")!
const recommendedCourses = document.querySelector("#recommended-courses")!

// Course Details Elements
const scheduleOpeningDay = document.querySelector("#schedule__opening-day")!
const time = document.querySelector("#schedule__time")!
const address = document.querySelector("#schedule__address")!
const schoolDays = document.querySelector("#schedule__school-days")!
const contentList = document.querySelector("#content-list")!
const requirements = document.querySelector("#required-requirements")!
const lectureList = document.querySelector("#lectures")!
const generalInfo = document.querySelector("#general-info")!


// Handle Course Details
document.addEventListener("DOMContentLoaded", async () => {
  renderSkeletonCourseDetails()
  const courseDetails = await fetchCourseDetails()
  renderCourseDetails(courseDetails[0])
})

function renderSkeletonCourseDetails() {
  const element = `
          <div
            class="flex flex-col w-full gap-20 animate__animated animate__fadeIn"
          >
            <div class="flex flex-col gap-6 lg:gap-10 lg:p-10">
              <div class="flex flex-col gap-4">
                <div class="lg:gap-1 flex flex-col lg:mb-16">
                  <div class="skeleton skeleton-text"></div>
                  <div
                    class="skeleton skeleton-text"
                  ></div>
                </div>

                <div
                  class="flex flex-col lg:flex-row gap-8 lg:gap-14 text-center lg:text-start"
                >
                  <div class="flex flex-col gap-4 flex-1">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                  </div>
                  <div class="flex flex-col gap-4 flex-1">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                  </div>
                  <div class="flex flex-col gap-4 flex-1">
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text"></div>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col lg:flex-row gap-6 items-center p-6"
              >
                <div class="flex items-center gap-2">
                  <div
                    class="w-10 h-10 skeleton rounded-full"
                  ></div>
                </div>
                <div
                  class="skeleton skeleton-text"
                ></div>
              </div>

              <button
                class="rounded-[40px] py-4 px-10 transition-transform duration-300 ease-in-out lg:w-[233px] h-14 w-full skeleton"
              >
              </button>
            </div>
          </div>
          <div
            class="hidden lg:block skeleton min-w-[543px] h-[543px]"
          ></div>
  `
  generalInfo.innerHTML += element
}

async function fetchCourseDetails() {
  try {
    const query = new URLSearchParams(window.location.search)
    const id = query.get("id") || '1'
    const response = await http.get(API_ENDPOINTS.courseDetail(id))
    return response.data
  } catch (error) {
    console.log("Error fetching course details: ", error)
    return null
  }
}

function renderCourseDetails(course: Course) {
  const teacher = course.lecturers.find(lecturer => lecturer.isTeacher)!

  // General Info Section
  generalInfo.innerHTML = ''
  const element = `
          <div
            class="flex flex-col w-full gap-20 animate__animated animate__fadeIn"
          >
            <div class="flex flex-col gap-6 lg:gap-10 lg:p-10">
              <div class="flex flex-col gap-4">
                <div class="lg:gap-1 flex flex-col lg:mb-16">
                  <p class="text-textSecondary text-lg" id="course-type">${course.type}</p>
                  <h4
                    class="text-h3 md:text-h2 font-bold text-[64px] leading-[89.6px]"
                    id="course-name"
                  >${course.name}</h4>
                </div>

                <div
                  class="flex flex-col lg:flex-row gap-8 lg:gap-14 text-center lg:text-start"
                >
                  <div class="flex flex-col gap-4">
                    <p class="text-textSecondary">Opening day</p>
                    <h5 class="text-h5 font-bold" id="opening-day">${course.schedule.openingDay}</h5>
                  </div>
                  <div class="flex flex-col gap-4">
                    <p class="text-textSecondary">Time limit</p>
                    <h5 class="text-h5 font-bold" id="time-limit">${course.schedule.time}</h5>
                  </div>
                  <div class="flex flex-col gap-4">
                    <p class="text-textSecondary">Learning form</p>
                    <h5 class="text-h5 font-bold" id="learning-form">${course.learningForm}</h5>
                  </div>
                </div>
              </div>

              <div
                class="flex flex-col lg:flex-row gap-6 bg-white justify-between items-center p-6"
              >
                <div class="flex items-center gap-2">
                  <img
                    src="${teacher.avatar}"
                    alt="avatar"
                    class="w-10 h-10"
                    id="teacher-avatar"
                  />
                  <p class="text-textSecondary" id="teacher-name">${teacher.name}</p>
                </div>
                <span
                  class="text-textPrimary font-bold text-xl"
                  id="price"
                >${course.price} VND</span>
              </div>

              <button
                class="bg-tertiaryBackground text-white rounded-[40px] py-4 px-10 font-bold hover:bg-primaryMain transition-transform duration-300 ease-in-out lg:w-[233px] w-full"
              >
                Register
              </button>
            </div>
          </div>
          <img
            class="hidden lg:block"
            alt="React"
            id="course-thumbnail"
            src="${course.image}"
          /> 
  `
  generalInfo.innerHTML = element

  // Schedule Section
  scheduleOpeningDay.innerHTML = course.schedule.openingDay
  time.innerHTML = course.schedule.time
  address.innerHTML = course.schedule.address
  for (const day of course.schedule.schoolDay) {
    const element = `
      <li class="text-h6 md:text-h5 font-bold">
        ${day.name}: ${day.days.join(", ")}
      </li>
    `

    schoolDays.innerHTML += element
  }

  // Content Section
  course.content.forEach((content, index) => {
    const li = document.createElement("li")
    li.classList.add("py-8", "px-10", `${index === 0 ? "bg-secondaryBackground" : "bg-inherit"}`, "flex", "flex-col", "gap-4", "border-b", "border-secondaryBackground", "cursor-pointer", "hover:opacity-80", "w-full", "content-item", "md:flex-[0_0_calc(50%-1rem)]", "self-start")
    const element = `
        <div class="flex justify-between">
          <span
            class="text-textPrimary font-bold text-lg hover:text-primaryMain"
          >
            ${content.lessonName}
          </span>
          <div class="hidden md:block">
            <img src="/src/assets/icons/arrow-up.png" alt="arrow up" class="${index === 0 ? "" : "hidden"}" />
            <img
              src="/src/assets/icons/arrow-down.png"
              class="${index === 0 ? "hidden" : ""}"
              alt="arrow down"
            />
          </div>
        </div>

        <ul
          class="text-textSecondary text-base md:text-lg px-4 list-disc flex flex-col gap-2 ${index === 0 ? "" : "hidden"}"
        >
          ${content.lessonContent.map(title => `<li>${title}</li>`).join("")}
        </ul>
    `
    li.innerHTML += element
    li.addEventListener("click", () => {
      const isOpen = !li.getElementsByTagName("ul")[0].classList.contains("hidden")
      if (isOpen) {
        li.classList.remove("bg-secondaryBackground")
        li.classList.add("bg-inherit")
        li.getElementsByTagName("img")[0].classList.add("hidden")
        li.getElementsByTagName("img")[1].classList.remove("hidden")
        li.getElementsByTagName("ul")[0].classList.add("hidden")
        li.getElementsByTagName("ul")[0].classList.remove("flex")
      } else {
        li.classList.add("bg-secondaryBackground")
        li.classList.remove("bg-inherit")
        li.getElementsByTagName("img")[0].classList.remove("hidden")
        li.getElementsByTagName("img")[1].classList.add("hidden")
        li.getElementsByTagName("ul")[0].classList.remove("hidden")
        li.getElementsByTagName("ul")[0].classList.add("flex")
      }
    })
    contentList.appendChild(li)
  })

  // Requirements Section
  for (const requirement of course.requirements) {
    const element = `
      <li class="flex gap-6">
        <img
          src="/src/assets/icons/check-select.png"
          alt="check select"
          class="w-6 h-6"
        />
        <p class="text-base md:text-lg text-textSecondary">
          ${requirement}
        </p>
      </li> 
    `

    requirements.innerHTML += element
  }

  for (const lecturer of course.lecturers) {
    lectureList.innerHTML += `
          <li
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer swiper-slide !flex flex-col items-center lg:items-start"
            data-animation="fadeIn"
          >
            <img
              src="${lecturer.avatar}"
              alt="avatar"
              class="w-[310px] h-[310px]"
            />
            <div
              class="absolute top-5 right-10 md:right-28 ${lecturer.isTeacher ? "bg-primaryMain text-white" : "bg-secondaryBackground text-textPrimary"} px-4 py-2"
            >
              ${lecturer.isTeacher ? "Teacher" : "Mentor"}
            </div>
            <div class="py-4 flex flex-col gap-4 w-[310px] h-[310px]">
              <div class="gap-1">
                <p class="text-textSecondary">${lecturer.title}</p>
                <h5 class="text-textPrimary text-2xl leading-9 font-bold">
                  ${lecturer.name}
                </h5>
              </div>
              <p class="md:text-lg text-textSecondary text-base">
                ${lecturer.bio}
              </p>
              <p class="underline text-lg text-textSecondary">
                ${lecturer.website}
              </p>
            </div>
          </li>
    `
  }

  new Swiper('#lecturer__swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    direction: 'horizontal',
    slidesPerView: 1,
    speed: 1000,
    modules: [Navigation, Autoplay],
    navigation: {
      prevEl: '#lecturer__swiper-button-prev',
      nextEl: '#lecturer__swiper-button-next',
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        speed: 1500,
      },
      1024: {
        slidesPerView: 4,
        speed: 1500,
      },
    }
  })
}


// Handle FAQ Section
document.addEventListener("DOMContentLoaded", () => {
  for (const faqItem of faqItems) {
    faqItem.addEventListener("click", () => {
      const p = faqItem.getElementsByTagName("p")[0]
      if (p.checkVisibility()) {
        faqItem.classList.remove("faq-item--active")
        faqItem.getElementsByTagName("img")[0].classList.add("hidden")
        faqItem.getElementsByTagName("img")[1].classList.remove("hidden")
        faqItem.getElementsByTagName("p")[0].classList.add("hidden")
      } else {
        faqItem.classList.add("faq-item--active")
        faqItem.getElementsByTagName("img")[0].classList.remove("hidden")
        faqItem.getElementsByTagName("img")[1].classList.add("hidden")
        faqItem.getElementsByTagName("p")[0].classList.remove("hidden")
      }
    })
  }
})


// Handle Recommended Courses
document.addEventListener("DOMContentLoaded", async () => {
  const courses = await fetchRecommendedCourses(3)
  renderRecommendedCourses(courses)
})

async function fetchRecommendedCourses(size: number, page: number = 1) {
  try {
    const response = await http.get<Course[]>(API_ENDPOINTS.courses + "?_page=" + page + "&_limit=" + size)
    return response.data
  } catch (error) {
    console.log("Error fetching courses: ", error)
    return []
  }
}

function renderRecommendedCourses(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher)!

    const element = `
          <div
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer"
            data-animation="fadeIn"
          >
            <a href="/src/pages/course-details.html?id=${course.id}">
              <img
                src="${course.image}"
                alt="${course.name}"
                class="md:w-[427px] md:h-[427px]"
              />
              <div
                class="absolute top-10 right-10 bg-primaryMain px-4 py-2 text-white"
              >
                ${course.learningForm}
              </div>
              <div class="p-5 md:p-10 flex flex-col gap-4 bg-secondaryBackground">
                <div class="flex flex-col gap-2">
                  <p class="text-[14px] text-textSecondary">${course.type}</p>
                  <h5 class="text-textPrimary text-2xl leading-9 font-bold">
                    ${course.name}
                  </h5>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img
                      src="${teacher.avatar}"
                      alt="${teacher.name}"
                      class="w-10 h-10 rounded-full"
                    />
                    <span class="text-textSecondary">${teacher.name}</span>
                  </div>
                  <span class="text-textPrimary font-bold text-xl"
                    >${course.price}đ</span
                  >
                </div>
              </div>
            </a>
          </div> 
    `

    recommendedCourses.innerHTML += element
  }
}
