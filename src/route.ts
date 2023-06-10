import { Routing } from 'express-zod-api';
import { getNotificationsEndpoint, readNotificationEndpoint } from './endpoint';

export const routing: Routing = {
    v1: {
        notifications: {
            list: getNotificationsEndpoint,
            read: readNotificationEndpoint,
        },
    },
};
