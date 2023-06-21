import { Routing } from 'express-zod-api';
import { getNotificationsEndpoint, readNotificationEndpoint, isReadNotificationEndPoint} from './endpoint';

export const routing: Routing = {
    v1: {
        notifications: {
            list: getNotificationsEndpoint,
            read: readNotificationEndpoint,
            isRead: isReadNotificationEndPoint
        },
    },
};
