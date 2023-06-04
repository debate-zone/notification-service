import {TopicEnum} from "../../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum";
import {kafka} from "../config";
import {newNotification} from "../../services/notificationService";
import {InviteToDebateZoneNotification, NewNotification} from "../../types";

export const consumeInviteToDebateZoneNotification = async () => {
    const consumer = kafka.consumer({groupId: "debate-zone"})
    await consumer.connect()
    await consumer.subscribe({topic: TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION})
    try {
        await consumer.run({
            eachMessage: async ({topic, partition, message}) => {
                if (message.value === null) {
                    console.error("message.value is null")
                } else {
                    let inviteToDebateZoneNotification: InviteToDebateZoneNotification
                    try {
                        inviteToDebateZoneNotification = JSON.parse(message.value.toString())
                        const notification = await newNotification({
                            producerUserId: inviteToDebateZoneNotification.userId,
                            consumerUserId: inviteToDebateZoneNotification.userId,
                            data: inviteToDebateZoneNotification,
                        })
                        console.info(`Notification consumed successfully, notification: ${JSON.stringify(notification)}`)
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        })
        console.info("Consumer for invite-to-debate-zone-notification started")
    } catch (e) {
        console.error(e)
    }
}
