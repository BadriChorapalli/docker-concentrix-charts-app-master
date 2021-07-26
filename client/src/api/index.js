
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
})

export const insertChart = payload => api.post(`/chart`, payload)
export const updateChartById = (id, payload) => api.put(`/chart/${id}`, payload)
export const getAllCharts = () => api.get(`/charts`)
export const deleteChartById = id => api.delete(`/chart/${id}`)

const apis = {
    insertChart,
    updateChartById,
    getAllCharts,
    deleteChartById,
   
}

export default apis
