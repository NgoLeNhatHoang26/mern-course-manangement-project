import axiosClient from "./api";

export const authService = {
    login : async ({email, password}) =>{
        const response = await axiosClient.post("/auth/login", {email, password});
        return response.data;
    },

    register : async ({userName, email, password}) =>{
        const response = await axiosClient.post("/auth/register", {userName, email, password});
        return response.data;
    },
    getMe : async (data) => {
        const response = await axiosClient.get("/auth/me")
        return response.data;
    }

}