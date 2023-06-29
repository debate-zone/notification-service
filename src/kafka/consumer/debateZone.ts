import { TopicEnum } from '../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum';
import { kafka } from '../config';
import { newNotification } from '../../services/notificationService';
import { mailgunService } from '../../services/mailgunService';
import {
    InvitedUserToDebate,
    JoinedToDebate,
} from '../../../../debate-zone-micro-service-common-library/src/kafka/types';
import { getEmailByUserId } from '../../services/notificationUserService';
import { getLabelByParticipantStatus } from '../../../../../common-library/src/debateZone/participantStatus';
import { KafkaMessage } from 'kafkajs';
import * as assert from 'assert';
import { generateImageBasedOnDebateTitle } from '../../services/imageService';
import {Type} from "../../types";

async function joinedToDebate(message: KafkaMessage) {
    assert(message.value !== null);

    let joinedToDebateZoneNotification: JoinedToDebate;

    joinedToDebateZoneNotification = JSON.parse(message.value.toString());
    const { producerUserId, consumerUserId, debateZoneTitle, ...data } =
        joinedToDebateZoneNotification;
    const notificationJoined = await newNotification({
        producerUserId: joinedToDebateZoneNotification.producerUserId,
        consumerUserId: joinedToDebateZoneNotification.consumerUserId,
        data: data,
        type: Type.Joined
    });

    console.info(
        `Notification consumed successfully, notification: ${JSON.stringify(
            notificationJoined,
        )}`,
    );

    if (!joinedToDebateZoneNotification.consumerEmail) {
        try {
            joinedToDebateZoneNotification.consumerEmail =
                await getEmailByUserId(
                    joinedToDebateZoneNotification.consumerUserId,
                );
        } catch (e) {
            console.error(e);
        }
    }

    if (joinedToDebateZoneNotification.consumerEmail) {
        console.log(joinedToDebateZoneNotification.debateZoneParticipantStatus);
        const debateZoneParticipantStatusLabel = getLabelByParticipantStatus(
            joinedToDebateZoneNotification.debateZoneParticipantStatus,
        ).toLowerCase();
        await mailgunService.sendEmail<JoinedToDebate>(
            `${joinedToDebateZoneNotification.producerFullName} has ${debateZoneParticipantStatusLabel} your debate "${joinedToDebateZoneNotification.debateZoneTitle}"`,
            {
                ...joinedToDebateZoneNotification,
                debateZoneParticipantStatusLabel,
            },
            process.env.MAILGUN_JOINED_TODEBATE_TEMPLATE,
        );
    }
}

async function invitedToDebate(message: KafkaMessage) {
    assert(message.value !== null);

    let inviteToDebateZoneNotification: InvitedUserToDebate;

    inviteToDebateZoneNotification = JSON.parse(message.value.toString());
    const notificationInvited = await newNotification({
        producerUserId: inviteToDebateZoneNotification.producerUserId,
        consumerUserId: inviteToDebateZoneNotification.consumerUserId,
        data: inviteToDebateZoneNotification,
        type: Type.Invited
    });
    console.info(
        `Notification consumed successfully, notification: ${JSON.stringify(
            notificationInvited,
        )}`,
    );

    inviteToDebateZoneNotification.debateZoneImageUrl =
        await generateImageBasedOnDebateTitle(
            inviteToDebateZoneNotification.debateZoneTitle,
        );

    if (inviteToDebateZoneNotification.consumerEmail) {
        await mailgunService.sendEmail<InvitedUserToDebate>(
            `You have been invited to debate "${inviteToDebateZoneNotification.debateZoneTitle}" by ${inviteToDebateZoneNotification.producerFullName}`,
            inviteToDebateZoneNotification,
            process.env.MAILGUN_INVITE_TODEBATE_TEMPLATE,
        );
    }
}

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
                                await joinedToDebate(message);
                                break;
                            case TopicEnum.INVITE_TO_DEBATE_ZONE_NOTIFICATION:
                                await invitedToDebate(message);
                                break;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            },
        });
        console.info('Consumer started');
    } catch (e) {
        console.error(e);
    }
};
