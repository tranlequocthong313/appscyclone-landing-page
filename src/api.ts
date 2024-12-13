import axios from 'axios'

export const API_ENDPOINTS = {
    courses: 'courses',
    courseDetail: (id: string) => 'courses/?id=' + id,
    evaluations: 'evaluations'
}

const http = axios.create({
    baseURL: 'https://wctcq9bl-3000.asse.devtunnels.ms/',
})

export default http
