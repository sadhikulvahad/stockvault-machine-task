import axios from 'axios';
import { API_ENDPOINTS } from './Routes/endPoint';
import axiosInstance from './axiosInstance';



export const SignupApi = async (phone: string, email: string, password: string) => {
    try {

        const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, {
            phone,
            email,
            password
        });
        return response
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        } else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}

export const LoginApi = async (email: string, password: string) => {
    try {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password
        }, {
            withCredentials: true
        });
        return response;
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

export const LogoutApi = async (token: string) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT, { token }, {
            withCredentials: true
        });
        return response;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response;
        }
        else {
            console.error("Unexpected error", error);
            return { status: 500, data: { error: "Unexpected error occurred" } };
        }
    }
}

