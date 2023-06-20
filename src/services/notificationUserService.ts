import { createHttpError } from 'express-zod-api';
import axios from 'axios';
import 'dotenv/config';

export const getEmailByUserId = async (userId: string) => {
    let email: string | undefined;
    try {
        const response = await axios.get<{ data: { email: string } }>(
            `${process.env.USER_MICRO_SERVICE_URL}/users/email?userId=${userId}`,
        );
        email = response.data.data.email;
    } catch (e: any) {
        throw createHttpError(500, `Cannot create user: ${e.message}`);
    }
    return email;
};
