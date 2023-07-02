import { TopicEnum } from '../../../../debate-zone-micro-service-common-library/src/kafka/topicsEnum';
import { kafka } from '../config';
import {
    invitedToDebate,
    joinedToDebate,
} from '../../services/notificationDebateZoneConsumerKafkaService';

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
