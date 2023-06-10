import { notificationDbController } from '../dbController';
import {
    NewNotification,
    Notification,
    OutputNotification,
    OutputNotificationList,
} from '../types';

export const getNotifications = async (): Promise<OutputNotificationList> => {
    const notifications: Notification[] =
        await notificationDbController.findAll({
            isRead: false,
        });
    return {
        notifications: notifications.map(notification => {
            const { __v, ...rest } = notification;
            return rest;
        }),
    };
};

export const readNotification = async (
    id: string,
): Promise<OutputNotification> => {
    const readNotification: Notification | null =
        await notificationDbController.save(
            {
                _id: id,
            },
            {
                isRead: true,
            },
        );

    if (!readNotification) {
        throw new Error('Notification not found');
    }

    const { __v, ...rest } = readNotification;

    return rest;
};

export const newNotification = async (notification: NewNotification) => {
    return await notificationDbController.create(notification);
};
