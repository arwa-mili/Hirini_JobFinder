//call backend
import axios from "axios"
const API_URL = "http://localhost:8800/api-v1";

export const API = axios.create({
    baseURL: API_URL,
    responseType: "json",
});

//chat requests
export const createChat = (data) => API.post('/chat/', data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);
//message requests
export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);



//back

export const apiRequest = async ({ url, token, data, method }) =>
{
    try
    {
        const result = await API(url, {
            method: method,
            data: data,
            headers: {
                "content-type": "application/json",
                Authorization: token ? `Bearer ${token}` :
                    "",
            }
        });
        return result?.data;
    } catch (error)
    {
        const err = error.response.data;
        console.log(error);
        return { status: err.success, message: err.message };
    }
}
export const handleFileUpload = async (uploadFile) =>
{
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "jobFinder");


    try
    {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/thelibrary/image/upload/",
            formData
        );
        return response.data.secure_url;
    } catch (error)
    {
        console.log(error)
    }
}

export const updateURL = ({

    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    jType,
    exp,
}) =>
{
    const params = new URLSearchParams();

    if (pageNum && pageNum > 1)
    {
        params.set("page", pageNum);

    }
    if (query)
    {
        params.set("search", query);
    }

    if (sort)
    {
        params.set("sort", cmpLoc);
    }
    if (navigate)
    {
        params.set("navigate", cmpLoc);
    } if (location)
    {
        params.set("location", cmpLoc);
    } if (jType)
    {
        params.set("jType", cmpLoc);
    } if (exp)
    {
        params.set("exp", cmpLoc);
    }

    const newURL = `${location.pathname}?${params.toString()}`;
    navigate(newURL, { replace: true });

    return newURL;

};



