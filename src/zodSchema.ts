import { z } from 'zod';
import {
    baseZodSchema,
    idObjectIdsSchema,
} from '../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';
export const notificationSchema = baseZodSchema.extend({
    producerUserId: idObjectIdsSchema,
    consumerUserId: idObjectIdsSchema,
    data: z.any(),
    isRead: z.boolean(),
});

export const newNotificationSchema = notificationSchema.omit({
    __v: true,
    _id: true,
    isRead: true,
    isDeleted: true,
});

export const updateNotificationSchema = notificationSchema.omit({
    __v: true,
});

export const outputNotificationSchema = notificationSchema.omit({
    __v: true,
});

export const outputNotificationListSchema = z.object({
    notifications: z.array(outputNotificationSchema),
});

export const inviteToDebateZoneNotificationSchema = z.object({
    userId: idObjectIdsSchema,
    role: z.string(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
});
