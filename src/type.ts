export interface Course {
    id: string
    image: string
    name: string
    type: string
    lecturers: Lecture[]
    learningForm: string
    price: string
    timeLimit: string
    introduction: string
    schedule: Schedule
    content: Content[]
    requirements: string[]
}

export interface Lecture {
    name: string
    avatar: string
    isTeacher: boolean
}

export interface Schedule {
    openingDay: string
    time: string
    days: SchoolDay[]
    address: string
}

export interface SchoolDay {
    name: string
    days: string[]
}

export interface Content {
    lessonName: string
    lessonContent: string[]
}

export interface Evaluation {
    id: string
    content: string
    author: Author
}

export interface Author {
    name: string
    avatar: string
    badge: string
}
