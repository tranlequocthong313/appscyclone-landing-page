import 'animate.css'
import http, { API_ENDPOINTS } from './api'
import { Course } from './type'

const faqItems = document.querySelectorAll(".faq-item")!
const recommendedCourses = document.querySelector("#recommended-courses")!

// Course Details Elements
const courseType = document.querySelector("#course-type")!
const courseName = document.querySelector("#course-name")!
const openingDay = document.querySelector("#opening-day")!
const timeLimit = document.querySelector("#time-limit")!
const learningForm = document.querySelector("#learning-form")!
const teacherAvatar = document.querySelector("#teacher-avatar")!
const teacherName = document.querySelector("#teacher-name")!
const price = document.querySelector("#price")!
const thumbnail = document.querySelector("#course-thumbnail") as HTMLImageElement
const scheduleOpeningDay = document.querySelector("#schedule__opening-day")!
const time = document.querySelector("#schedule__time")!
const address = document.querySelector("#schedule__address")!
const schoolDays = document.querySelector("#schedule__school-days")!
const contentList = document.querySelector("#content-list")!
const requirements = document.querySelector("#required-requirements")!
const lectureList = document.querySelector("#lectures")!


// Handle Navbar Menu On Small Screen Device
document.getElementById("menuToggle")!.addEventListener("click", function () {
  const menu = document.getElementById("menu")!
  menu.classList.toggle("hidden")
})


// Handle Course Details
document.addEventListener("DOMContentLoaded", async () => {
  const courseDetails = await fetchCourseDetails()
  renderCourseDetails(courseDetails[0])
})

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
  courseType.innerHTML = course.type
  courseName.innerHTML = course.name
  openingDay.innerHTML = course.schedule.openingDay
  timeLimit.innerHTML = course.schedule.time
  learningForm.innerHTML = course.learningForm
  teacherAvatar.innerHTML = teacher.avatar
  teacherName.innerHTML = teacher.name
  price.innerHTML = course.price + " VND"
  thumbnail.src = course.image

  // Schedule Section
  scheduleOpeningDay.innerHTML = course.schedule.openingDay
  time.innerHTML = course.schedule.time
  address.innerHTML = course.schedule.address
  for (const day of course.schedule.schoolDay) {
    const element = `
      <li class="text-h5 font-bold">
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
          class="text-textSecondary text-lg px-4 list-disc flex flex-col gap-2 ${index === 0 ? "" : "hidden"}"
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
        <p class="text-lg text-textSecondary">
          ${requirement}
        </p>
      </li> 
    `

    requirements.innerHTML += element
  }

  for (const lecturer of course.lecturers) {
    lectureList.innerHTML += `
          <div
            class="relative animate-on-scroll hover:!scale-105 cursor-pointer md:w-[310px]"
            data-animation="fadeIn"
          >
            <a>
              <img
                src="${lecturer.avatar}"
                alt="avatar"
                class="w-full"
              />
              <div
                class="absolute top-5 right-5 ${lecturer.isTeacher ? "bg-primaryMain text-white" : "bg-secondaryBackground text-textPrimary"} px-4 py-2"
              >
                ${lecturer.isTeacher ? "Teacher" : "Mentor"}
              </div>
              <div class="py-4 flex flex-col gap-4">
                <div class="gap-1">
                  <p class="text-textSecondary">${lecturer.title}</p>
                  <h5 class="text-textPrimary text-2xl leading-9 font-bold">
                    ${lecturer.name}
                  </h5>
                </div>
                <p class="text-lg text-textSecondary">
                  ${lecturer.bio}
                </p>
                <p class="underline text-lg text-textSecondary">
                  ${lecturer.website}
                </p>
              </div>
            </a>
          </div>
    `
  }
}


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
            <a>
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
              <div class="p-10 flex flex-col gap-4 bg-secondaryBackground">
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
