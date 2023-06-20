import { TopicEnum } from '../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum';
import { kafka } from '../config';
import { newNotification } from '../../services/notificationService';
import { mailgunService } from '../../services/mailgunService';
import {
    InvitedUserToDebate,
    JoinedToDebate,
} from '../../../../debate-zone-micro-service-common-library/src/kafka/types';
import { getEmailByUserId } from '../../services/notificationUserService';

export const consumeKafkaEvents = async () => {
    const consumer = kafka.consumer({ groupId: 'debate-zone' });
    await consumer.connect();
    await consumer.subscribe({
        topics: [
            TopicEnum.JOINED_TO_DEBATE_ZONE_NOTIFICATION,
            TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION,
        ],
    });
    try {
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value === null) {
                    console.error('message.value is null');
                } else {
                    try {
                        switch (topic) {
                            case TopicEnum.JOINED_TO_DEBATE_ZONE_NOTIFICATION:
                                let joinedToDebateZoneNotification: JoinedToDebate;

                                joinedToDebateZoneNotification = JSON.parse(
                                    message.value.toString(),
                                );
                                const {
                                    producerUserId,
                                    consumerUserId,
                                    debateZoneTitle,
                                    ...data
                                } = joinedToDebateZoneNotification;
                                const notificationJoined =
                                    await newNotification({
                                        producerUserId:
                                            joinedToDebateZoneNotification.producerUserId,
                                        consumerUserId:
                                            joinedToDebateZoneNotification.consumerUserId,
                                        data: data,
                                    });

                                console.info(
                                    `Notification consumed successfully, notification: ${JSON.stringify(
                                        notificationJoined,
                                    )}`,
                                );

                                if (
                                    !joinedToDebateZoneNotification.consumerEmail
                                ) {
                                    try {
                                        joinedToDebateZoneNotification.consumerEmail =
                                            await getEmailByUserId(
                                                joinedToDebateZoneNotification.consumerUserId,
                                            );
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }

                                if (
                                    joinedToDebateZoneNotification.consumerEmail
                                ) {
                                    await mailgunService.sendEmail(
                                        joinedToDebateZoneNotification.consumerEmail,
                                        `${joinedToDebateZoneNotification.producerFullName} has joined your debate ${joinedToDebateZoneNotification.debateZoneTitle}.`,
                                        `${joinedToDebateZoneNotification.producerFullName} has joined your debate ${joinedToDebateZoneNotification.debateZoneTitle}. ${joinedToDebateZoneNotification.debateZoneShortDescription}`,
                                    );
                                }
                                break;
                            case TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION:
                                let inviteToDebateZoneNotification: InvitedUserToDebate;

                                inviteToDebateZoneNotification = JSON.parse(
                                    message.value.toString(),
                                );
                                const notificationInvited =
                                    await newNotification({
                                        producerUserId:
                                            inviteToDebateZoneNotification.producerUserId,
                                        consumerUserId:
                                            inviteToDebateZoneNotification.consumerUserId,
                                        data: inviteToDebateZoneNotification,
                                    });
                                console.info(
                                    `Notification consumed successfully, notification: ${JSON.stringify(
                                        notificationInvited,
                                    )}`,
                                );

                                if (
                                    inviteToDebateZoneNotification.consumerEmail
                                ) {
                                    await mailgunService.sendEmail(
                                        inviteToDebateZoneNotification.consumerEmail,
                                        `You have been invited to debate ${inviteToDebateZoneNotification.debateZoneTitle} by ${inviteToDebateZoneNotification.producerFullName}.`,
                                        `You have been invited to debate ${inviteToDebateZoneNotification.debateZoneTitle} by ${inviteToDebateZoneNotification.producerFullName}. ${inviteToDebateZoneNotification.debateZoneShortDescription}`,
                                    );
                                }
                                break;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            },
        });
        console.info('Consumer for invite-to-debate-zone-notification started');
    } catch (e) {
        console.error(e);
    }
};
