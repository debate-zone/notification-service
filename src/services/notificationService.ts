import { notificationDbController } from '../dbController';
import {
    NewNotification,
    Notification, OutputIsReadNotification,
    OutputNotification,
    OutputNotificationList,
} from '../types';
import {readAllNotifications} from "../endpoint";

export const getNotifications = async (
    userId: string,
): Promise<OutputNotificationList> => {
    const notifications: Notification[] =
        await notificationDbController.findAll({
            $and: [
                {
                    isRead: false,
                },
                {
                    consumerUserId: userId,
                },
            ],
        });
    return {
        notifications: notifications.map(notification => {
            const { __v, ...rest } = notification;
            return rest;
        }),
    };
};

export const isReadNotification = async (
    userId: string,

): Promise<OutputIsReadNotification> => {
    const notification: Notification | null =
        await notificationDbController.findOne(
            {
                consumerUserId: userId,
                isRead: false
            }
        )
    return {isRead: !notification}
}

export const readNotification = async (
    id: string,
    userId: string,
): Promise<OutputNotification> => {

    const readNotification: Notification | null =
        await notificationDbController.save(
            {
                $and: [
                    {
                        _id: id
                    },
                    {
                        consumerUserId: userId
                    }
                ]
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

export const readAll = async (userId: string) => {
    await notificationDbController.setAsReadForAll(userId)
}

export const newNotification = async (notification: NewNotification) => {
    return await notificationDbController.create(notification);
};
