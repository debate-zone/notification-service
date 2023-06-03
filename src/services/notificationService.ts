import {notificationDbController} from "../dbController";
import {NewNotification, Notification, OutputNotification, OutputNotificationList} from "../types";

export const getNotifications = async (): Promise<OutputNotificationList> => {
    const notifications: Notification[] = await notificationDbController.findAll({
        consumerUserId: "auth_user_id",
        isRead: false
    })
    return {
        notifications
    }
}

export const readNotification = async (id: string): Promise<OutputNotification> => {
    const readNotification = await notificationDbController.save({
        _id: id
    }, {
        isRead: true
    })

    return readNotification as OutputNotification
}

export const newNotification = async (notification: NewNotification) => {
    return await notificationDbController.save({}, notification)
}
