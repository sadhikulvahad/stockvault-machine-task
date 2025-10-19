import axios from "axios";
import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./Routes/endPoint";


export const getUser = async () => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.GET_PROFILE)
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

export const resetPassword = async (oldPassword: string, newPassword: string, userId: string | undefined) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.PROFILE.RESET_PASSWORD, { oldPassword, newPassword, userId })
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("Axios Error Details:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error; // Ensure the error propagates
        } else {
            console.error("Unexpected Error:", error);
            throw new Error("Unexpected error occurred");
        }
    }
}