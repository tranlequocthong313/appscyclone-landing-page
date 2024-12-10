import axios from 'axios'

export const API_ENDPOINTS = {
    courses: 'courses',
    courseDetail: (id: string) => 'courses/' + id,
    evaluations: 'evaluations'
}

const http = axios.create({
    baseURL: 'http://localhost:3000/'
})

export default http
