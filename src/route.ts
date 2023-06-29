import { Routing } from 'express-zod-api';
import {
    getNotificationsEndpoint,
    readNotificationEndpoint,
    isReadNotificationEndPoint,
    readAllNotifications
} from './endpoint';

export const routing: Routing = {
    v1: {
        notifications: {
            list: getNotificationsEndpoint,
            read: readNotificationEndpoint,
            "read-all": readAllNotifications,
            isRead: isReadNotificationEndPoint
        },
    },
};
