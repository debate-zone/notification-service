import { createMiddleware, defaultEndpointsFactory } from 'express-zod-api';
import {
    outputNotificationListSchema,
    outputNotificationSchema,
} from './zodSchema';
import { z } from 'zod';
import { OutputNotification, OutputNotificationList } from './types';
import {
    getNotifications,
    readNotification,
} from './services/notificationService';

export const authMiddleware = createMiddleware({
    input: z.object({}),
    middleware: async ({ input: {}, request, logger }) => {
        const userId = request.headers['x-user-id'] as string;
        const userRole = request.headers['x-user-role'] as string;

        return {
            userId,
            userRole,
        };
    },
});

export const endpointsFactory =
    defaultEndpointsFactory.addMiddleware(authMiddleware);

export const getNotificationsEndpoint = endpointsFactory.build({
    method: 'get',
    input: z.object({}),
    output: outputNotificationListSchema,
    handler: async ({
        input,
        options,
        logger,
    }): Promise<OutputNotificationList> => {
        logger.debug('Options:', options);
        return await getNotifications(options.userId);
    },
});

export const readNotificationEndpoint = endpointsFactory.build({
    method: 'put',
    input: z.object({
        id: z.string(),
    }),
    output: outputNotificationSchema,
    handler: async ({
        input,
        options,
        logger,
    }): Promise<OutputNotification> => {
        logger.debug('Options:', options);
        return await readNotification(input.id, options.userId);
    },
});
