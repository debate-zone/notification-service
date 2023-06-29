import { BaseDbController } from '../../debate-zone-micro-service-common-library/src/mongoose/baseDbController';
import { Notification } from './types';
import { notificationMongooseModel } from './mongooseSchema';

class NotificationDbController extends BaseDbController<Notification> {
    setAsReadForAll = async (
        userId: string,
    ) => {
        await this.model.updateMany(
            {
                consumerUserId: userId,
            },
            {
                isRead: true
            },
        ).exec();
    };
}

export const notificationDbController = new NotificationDbController(
    notificationMongooseModel,
);
