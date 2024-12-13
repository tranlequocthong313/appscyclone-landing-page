import 'animate.css'
import 'swiper/css'

import http, { API_ENDPOINTS } from './api'
import { Course, Evaluation } from './type'
import Swiper from 'swiper'
import { Navigation, Autoplay } from 'swiper/modules'


const courseComingUp = document.querySelector("#course-coming-up .swiper-wrapper")!
const courseList = document.querySelector("#course-list")!
const evaluationElement = document.querySelector("#evaluation")!
const faqItems = document.querySelectorAll(".faq-item")


// Handle Coming Course & All Courses Section
document.addEventListener("DOMContentLoaded", async () => {
  renderSkeletonComingCourses()
  renderSkeletonCourses()

  const courses = await fetchCourses()
  renderComingCourses(courses)
  renderCourses(courses.slice(0, 4))

  new Swiper('#course-coming-up', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    direction: 'horizontal',
    speed: 1000,
    modules: [Navigation, Autoplay],
    navigation: {
      prevEl: '#coming-course__swiper-button-prev',
      nextEl: '#coming-course__swiper-button-next',
    },
  })
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

function renderSkeletonComingCourses() {
  const element = `
            <div
              class="!flex items-center w-full justify-center relative px-2.5 swiper-slide lg:-left-20"
            >
              <img
                class="w-[427px] h-[427px] relative -left-24 hidden lg:block skeleton"
              />
              <div
                class="flex flex-col w-full max-w-[504px] gap-20"
              >
                <div class="flex flex-col gap-10">
                  <div class="flex flex-col gap-4">
                    <div class="gap-1 flex flex-col mb-7">
                      <div class="skeleton skeleton-text mb-5"></div>
                      <div class="skeleton skeleton-text"></div>
                    </div>
                    <div class="flex items-center gap-2">
                      <div class="rounded-full w-10 h-10 skeleton"></div>
                      <div class="skeleton skeleton-text"></div>
                    </div>
                  </div>
                  <div class="flex gap-14">
                    <div class="flex flex-col gap-4 flex-1">
                      <div class="skeleton skeleton-text mb-5"></div>
                      <div class="skeleton skeleton-text"></div>
                    </div>
                    <div class="flex flex-col gap-4 flex-1">
                      <div class="skeleton skeleton-text mb-5"></div>
                      <div class="skeleton skeleton-text"></div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-4 flex-col lg:flex-row">
                  <button
                    class="rounded-[40px] py-4 px-10 transition-transform duration-300 ease-in-out skeleton lg:w-[220px] h-14"
                  >
                  </button>
                  <button
                    class="rounded-[40px] py-4 px-6 w-full lg:w-[220px] h-14 border transition-transform duration-300 ease-in-out skeleton"
                  >
                  </button>
                </div>
              </div>
            </div>
          `

  courseComingUp.innerHTML += element
}

function renderComingCourses(courses: Course[]) {
  courseComingUp.innerHTML = ''

  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `
            <div
              class="!flex items-center w-full justify-center relative px-2.5 swiper-slide lg:-left-20"
            >
              <img
                src="${course.image}"
                class="w-[427px] h-[427px] relative -left-24 hidden lg:block"
                alt="${course.name}"
              />
              <div
                class="flex flex-col w-full max-w-[504px] gap-20"
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
                      <h5 class="text-h6 md:text-h5 font-bold">${course.schedule.openingDay}</h5>
                    </div>
                    <div class="flex flex-col gap-4">
                      <p class="text-textSecondary">Learning form</p>
                      <h5 class="text-h6 md:text-h5 font-bold">${course.learningForm}</h5>
                    </div>
                  </div>
                </div>
                <div class="flex gap-4 flex-col lg:flex-row">
                  <button
                    class="bg-tertiaryBackground text-white rounded-[40px] py-4 px-10 font-bold hover:bg-primaryMain transition-transform duration-300 ease-in-out"
                  >
                    <a href="/src/pages/register.html" class="block w-full h-full">
                      Register for school
                    </a>
                  </button>
                  <button
                    class="bg-transparent text-textPrimary rounded-[40px] py-4 px-6 w-full lg:w-[220px] border border-tertiaryBackground font-bold hover:border-primaryMain hover:text-primaryMain transition-transform duration-300 ease-in-out"
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
}

function renderSkeletonCourses() {
  for (let i = 0; i < 4; i++) {
    const element = document.createElement('div')
    element.classList.add('relative', 'animate-on-scroll', 'hover:!scale-105', 'cursor-pointer', 'course-item-skeleton')
    element.setAttribute('data-animation', 'fadeIn')
    element.innerHTML += `
            <div class="skeleton w-[351px] h-[351px] md:w-[570px] md:h-[570px]"></div>
            <div
              class="absolute top-10 right-10 px-4 py-2"
            >
            </div>
            <div class="p-4 md:p-10 flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-full skeleton"></div>
                </div>
                <div class="skeleton skeleton-text"></div>
              </div>
            </div>
      `

    courseList.insertBefore(element, courseList.childNodes[2])
  }
}

function renderCourses(courses: Course[]) {
  for (const courseItemSkeleton of courseList.querySelectorAll('.course-item-skeleton')) {
    courseList.removeChild(courseItemSkeleton)
  }

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
              <div class="p-4 md:p-10 flex flex-col gap-4 bg-secondaryBackground">
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


// Handle Team Swiper
document.addEventListener("DOMContentLoaded", () => {
  new Swiper('#team__swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    direction: 'horizontal',
    slidesPerView: 1,
    speed: 1000,
    modules: [Navigation, Autoplay],
    navigation: {
      prevEl: '#team__swiper-button-prev',
      nextEl: '#team__swiper-button-next',
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
})


// Evaluation
document.addEventListener("DOMContentLoaded", async () => {
  renderSkeletonEvaluations()
  const evaluations = await fetchEvaluations()
  renderEvaluations(evaluations)

  new Swiper('#evaluation__swiper', {
    loop: true,
    autoplay: {
      delay: 5000,
    },
    direction: 'horizontal',
    speed: 1000,
    modules: [Navigation, Autoplay],
    navigation: {
      prevEl: '#evaluation__swiper-button-prev',
      nextEl: '#evaluation__swiper-button-next',
    },
  })
})

async function fetchEvaluations() {
  try {
    const response = await http.get(API_ENDPOINTS.evaluations)
    return response.data
  } catch (error) {
    console.error('Error fetching evaluation:', error)
    return []
  }
}

function renderSkeletonEvaluations() {
  const element = `
    <div
      class="p-8 w-[426px] h-[426px] border border-gray-4 animate-on-scroll swiper-slide"
      data-animation="fadeIn"
    >
      <div
        class="w-10 h-10 mb-10 skeleton"
      ></div>
      <div class="mb-14">
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
        <div class="skeleton skeleton-text mb-4"></div>
      </div>
      <div class="flex items-center gap-2">
        <div class="rounded-full w-12 h-12 md:w-16 md:h-16 skeleton"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `
  evaluationElement.innerHTML += element
}

function renderEvaluations(evaluations: Evaluation[]) {
  evaluationElement.innerHTML = ''

  for (const evaluation of evaluations) {
    const element = `
      <div
        class="p-8 border border-gray-4 w-full max-w-[426px] h-[426px] animate-on-scroll hover:!scale-105 cursor-pointer swiper-slide"
        data-animation="fadeIn"
      >
        <img
          src="src/assets/images/quote.png"
          class="w-8 h-6 mb-10 -scale-x-100"
          alt="quote"
        />
        <p class="text-textSecondary text-md md:text-lg mb-14 line-clamp-6">
          ${evaluation.content}
        </p>
        <div class="flex items-center gap-2">
          <img
            src="${evaluation.author.avatar}"
            alt="avatar"
            class="rounded-full w-12 h-12 md:w-16 md:h-16"
          />
          <div class="flex flex-col gap-1">
            <h6 class="text-lg font-bold">${evaluation.author.name}</h6>
            <p class="text-textSecondary">${evaluation.author.badge}</p>
          </div>
        </div>
      </div>
    `
    evaluationElement.innerHTML += element
  }
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
