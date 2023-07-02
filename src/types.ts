import {
    inviteToDebateZoneNotificationSchema,
    newNotificationSchema,
    notificationSchema,
    outputIsReadNotificationSchema,
    outputNotificationListSchema,
    outputNotificationSchema,
    updateNotificationSchema,
} from './zodSchema';
import { z } from 'zod';

export type Notification = z.infer<typeof notificationSchema>;

export type UpdateNotification = z.infer<typeof updateNotificationSchema>;

export type OutputNotification = z.infer<typeof outputNotificationSchema>;

export type NewNotification = z.infer<typeof newNotificationSchema>;

export type OutputNotificationList = z.infer<
    typeof outputNotificationListSchema
>;

export type InviteToDebateZoneNotification = z.infer<
    typeof inviteToDebateZoneNotificationSchema
>;

export type OutputIsReadNotification = z.infer<
    typeof outputIsReadNotificationSchema
>;
