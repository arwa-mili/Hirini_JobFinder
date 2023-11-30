import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8800/api-v1" });

API.interceptors.request.use((req) =>
{
    if (localStorage.getItem('profile'))
    {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
});

export const getUser2 = (userId) => API.get(`companies/get-company/${userId}`);
export const getUser = (userId) => API.get(`/users/get-user/${userId}`);
export const updateUser = (id, formData) => API.put(`/user/${id}`, formData);
export const getAllUser = () => API.get('companies/get-company/')
