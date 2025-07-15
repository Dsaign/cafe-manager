import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
})

export const ping = async () => {
  const res = await api.get('/ping')
  return res.data
}