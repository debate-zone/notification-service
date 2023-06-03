import {z} from "zod"
import { baseZodSchema } from '../../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';
export const notificationSchema = baseZodSchema.extend({
    producerUserId: z.string(),
    consumerUserId: z.string(),
    data: z.string(),
    isRead: z.boolean(),
})

export const newNotificationSchema = notificationSchema.omit({
    __v: true,
    _id: true,
})

export const updateNotificationSchema = notificationSchema.omit({
    __v: true,
})

export const outputNotificationSchema = notificationSchema.omit({
    __v: true,
})

export const outputNotificationListSchema = z.object({
    notifications: z.array(outputNotificationSchema),
})
