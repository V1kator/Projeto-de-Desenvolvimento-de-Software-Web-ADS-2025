import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5046', // ou https://localhost:7074 se preferir usar HTTPS
  headers: {
    'Content-Type': 'application/json'
  },
    withCredentials: false
})

export default api
