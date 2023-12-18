import redaxios from "redaxios";
import {DayDTO} from "@/model/DayDTO.ts";
import {MealDTO} from "@/model/MealDTO.ts";

const BASE_URL = "http://localhost:8080/api/meal";

export const getAllMealsInaDay = async (day: DayDTO): Promise<MealDTO[]> => {
    try {
        const token = localStorage.getItem('token');

        const response = await redaxios.post(`${BASE_URL}/getAllMealsInADay/`, day, {
            headers: {
                Authorization: `${token}`
            }
        });

        if (response.status === 404) {
            return [];
        }

        return response.data;
    } catch (e) {
        console.error('Error fetching data:', e)
        throw e;
    }
};

export const createMeal = async (meal: MealDTO): Promise<string> => {
    try {
        const token = localStorage.getItem('token');

        console.log(meal);

        const response = await redaxios.post(`${BASE_URL}/create/`, meal, {
            headers: {
                Authorization: `${token}`
            }
        });

        console.log(response.data);

        return response.data;
    } catch (e) {
        console.error('Error fetching data:', e)
        throw e;
    }
};
