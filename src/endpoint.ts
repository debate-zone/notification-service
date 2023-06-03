import {defaultEndpointsFactory} from "express-zod-api"
import {outputNotificationListSchema, outputNotificationSchema} from "./zodSchema";
import {z} from "zod";
import {OutputNotification, OutputNotificationList} from "./types";
import {getNotifications, readNotification} from "./services/notificationService";

export const getNotificationsEndpoint = defaultEndpointsFactory.build({
    method: "get",
    input: z.object({}),
    output: outputNotificationListSchema,
    handler: async ({input, options, logger }): Promise<OutputNotificationList> => {
        logger.debug("Options:", options)
        return await getNotifications()
    },
})

export const readNotificationEndpoint = defaultEndpointsFactory.build({
    method: "put",
    input: z.object({
        id: z.string(),
    }),
    output: outputNotificationSchema,
    handler: async ({input, options, logger }): Promise<OutputNotification> => {
        logger.debug("Options:", options)
        return await readNotification(input.id)
    }
})