import redaxios from "redaxios";

const BASE_URL = "http://localhost:8080/api/exercise";
export const getAutocompleteExercise = async (value: string) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found')
        }
        const response = await redaxios.get(`${BASE_URL}/getAutoComplete/${value}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching data:', e)
        throw e;
    }
};

export const getAllExerciseByCategoryName = async (categoryName: string | undefined) => {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found')
        }
        const response = await redaxios.get(`${BASE_URL}/getAllByCategoryName?categoryName=${categoryName}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        return response.data;
    } catch (e) {
        console.error('Error fetching data:', e)
        throw e;
    }
};

