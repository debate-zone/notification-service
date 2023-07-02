import { z } from 'zod';
import {
    baseZodSchema,
    idObjectIdsSchema,
} from '../../debate-zone-micro-service-common-library/src/zod/baseZodSchema';
import { Type } from '../../../common-library/src/notifications/types';

export const notificationSchema = baseZodSchema.extend({
    producerUserId: idObjectIdsSchema,
    consumerUserId: idObjectIdsSchema,
    data: z.any(),
    isRead: z.boolean(),
    type: z.nativeEnum(Type).optional(),
    entityId: idObjectIdsSchema.optional(),
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

export const outputIsReadNotificationSchema = z.object({
    isRead: z.boolean(),
});
export const outputNotificationListSchema = z.object({
    notifications: z.array(outputNotificationSchema),
});

export const inviteToDebateZoneNotificationSchema = z.object({
    producerUserId: idObjectIdsSchema,
    producerUserFullName: z.string(),
    debateZoneId: idObjectIdsSchema,
    debateZoneTitle: z.string(),
    debateZoneShortDescription: z.string(),
    userId: idObjectIdsSchema,
    role: z.string(),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
});
