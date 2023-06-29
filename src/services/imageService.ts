import axios from 'axios';
import 'dotenv/config';

export const generateImageBasedOnDebateTitle = async (
    debateTitle: string,
): Promise<string | undefined> => {
    try {
        const response = await axios.post<{
            created: number;
            data: { url: string }[];
        }>(
            'https://api.openai.com/v1/images/generations',
            {
                prompt: `This is a logo for a debate. The debate title is: ${debateTitle}.`,
                n: 1,
                size: '512x512',
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            },
        );

        return response?.data?.data[0]?.url;
    } catch (e) {
        console.error(e);
        return undefined;
    }
};
