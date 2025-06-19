import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})

api.interceptors.response.use(
    (response)=> response,
    async (error) => {
        const originalRequest = error.config

        if (error.response && error.response.status === 401 && !originalRequest._retry){
            // console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhahahah")
            originalRequest._retry = true

            try{
                const res = await api.post("http://localhost:5000/refresh")
                const newAccessToken = res.data.accessToken

                // console.log("newnewnew", newAccessToken)

                api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                localStorage.setItem("chat-app", JSON.stringify(res.data))

                return api(originalRequest)
            } catch (err) {
                localStorage.clear("chat-app")
                window.location.href = "/login"
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)