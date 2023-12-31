import redaxios from "redaxios";

const BASE_URL = "http://localhost:8080/api/enum";
export const getGenders = async () => {
    const response = await redaxios.get(`${BASE_URL}/gender`);
    return response.data;
};