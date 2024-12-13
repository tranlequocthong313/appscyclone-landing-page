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
  const courses = await fetchCourses()
  renderCourse(courses)
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
      nextEl: '#coming-course__swiper-button-prev',
      prevEl: '#coming-course__swiper-button-next',
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

function renderCourse(courses: Course[]) {
  for (const course of courses) {
    const teacher = course.lecturers.find(lecturer => lecturer.isTeacher) || course.lecturers[0]

    const element = `
            <div
              class="!flex items-center w-full justify-center relative px-2.5 swiper-slide md:-left-20"
            >
              <img
                src="${course.image}"
                class="w-[427px] h-[427px] relative -left-24 hidden md:block"
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
                    class="bg-tertiaryBackground text-white rounded-[40px] py-4 px-10 font-bold hover:bg-primaryMain transition-transform duration-300 ease-in-out"
                  >
                    <a href="/src/pages/register.html" class="block w-full h-full">
                      Register for school
                    </a>
                  </button>
                  <button
                    class="bg-transparent text-textPrimary rounded-[40px] py-4 px-6 w-full md:w-[220px] border border-tertiaryBackground font-bold hover:border-primaryMain hover:text-primaryMain transition-transform duration-300 ease-in-out"
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
        slidesPerView: 4,
        speed: 1500,
      }
    }
  })
})


// Evaluation
document.addEventListener("DOMContentLoaded", async () => {
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
      nextEl: '#evaluation__swiper-button-prev',
      prevEl: '#evaluation__swiper-button-next',
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

function renderEvaluations(evaluations: Evaluation[]) {
  for (const evaluation of evaluations) {
    const element = `
      <div
        class="p-8 border border-gray-4 w-full max-w-[426px] h-[426px] animate-on-scroll hover:scale-105 cursor-pointer swiper-slide"
        data-animation="fadeIn"
      >
        <img
          src="src/assets/images/quote.png"
          class="w-8 h-6 mb-10 -scale-x-100"
          alt="quote"
        />
        <p class="text-textSecondary text-lg mb-14 line-clamp-6">
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
      </div>
    `
    evaluationElement.innerHTML += element
  }
}



// Handle FAQ Section
document.addEventListener("DOMContentLoaded", () => {
  for (const faqItem of faqItems) {
    faqItem.addEventListener("click", () => {
      const isOpen = !faqItem.getElementsByTagName("p")[0].classList.contains("hidden")
      if (isOpen) {
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
