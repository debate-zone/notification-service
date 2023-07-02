import { KafkaMessage } from 'kafkajs';
import * as assert from 'assert';
import {
    InvitedUserToDebate,
    JoinedToDebate,
} from '../../../debate-zone-micro-service-common-library/src/kafka/types';
import { newNotification } from './notificationService';
import { Type } from '../../../../common-library/src/notifications/types';
import { getEmailByUserId } from './notificationUserService';
import { getLabelByParticipantStatus } from '../../../../common-library/src/debateZone/participantStatus';
import { mailgunService } from './mailgunService';
import { generateImageBasedOnDebateTitle } from './imageService';

export async function joinedToDebate(message: KafkaMessage) {
    assert(message.value !== null);

    let joinedToDebateZoneNotification: JoinedToDebate;

    joinedToDebateZoneNotification = JSON.parse(message.value.toString());
    const { producerUserId, consumerUserId, debateZoneTitle, ...data } =
        joinedToDebateZoneNotification;
    const notificationJoined = await newNotification({
        producerUserId: joinedToDebateZoneNotification.producerUserId,
        consumerUserId: joinedToDebateZoneNotification.consumerUserId,
        data: data,
        type: Type.Joined,
        entityId: joinedToDebateZoneNotification.debateZoneId,
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

export async function invitedToDebate(message: KafkaMessage) {
    assert(message.value !== null);

    let inviteToDebateZoneNotification: InvitedUserToDebate;

    inviteToDebateZoneNotification = JSON.parse(message.value.toString());
    const notificationInvited = await newNotification({
        producerUserId: inviteToDebateZoneNotification.producerUserId,
        consumerUserId: inviteToDebateZoneNotification.consumerUserId,
        data: inviteToDebateZoneNotification,
        type: Type.Invited,
        entityId: inviteToDebateZoneNotification.debateZoneId,
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
