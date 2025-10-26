import axios from "axios";
import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./Routes/endPoint";


export const getposts = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.POST.GET_POSTS, {
            withCredentials: true
        })

        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}

export const createPost = async (formData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.POST.CREATE_POST, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
};

export const deletePost = async (postId: string) => {
    try {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.POST.DELETE_POST}${postId}`)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}


export const updatePost = async (id: number, formData: FormData) => {
    try {
        const response = await axiosInstance.put(`${API_ENDPOINTS.POST.UPDATE_POST}${id}`, formData)
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}

export const changePosition = async (imageOneId: number, imageTwoId: number) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.POST.UPDATE_POSITION, { imageOneId, imageTwoId })
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}