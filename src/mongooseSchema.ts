import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';
import { Notification } from './types';
import { baseSchema } from '../../debate-zone-micro-service-common-library/src/mongoose/baseSchema';
import { CollectionsEnum } from '../../debate-zone-micro-service-common-library/src/enums/collectionsEnum';

export type MongooseDocument = Document & Notification;

export const notificationMongooseSchema: mongoose.Schema = baseSchema.add({
    producerUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    consumerUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    data: {
        type: Schema.Types.Mixed,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

export const notificationMongooseModel = mongoose.model<MongooseDocument>(
    CollectionsEnum.NOTIFICATION,
    notificationMongooseSchema,
);
