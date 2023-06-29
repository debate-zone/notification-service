import Mailgun from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
const formData = require('form-data');
import 'dotenv/config';
import { BaseKafkaMessage } from '../../../debate-zone-micro-service-common-library/src/kafka/types';

class MailgunService {
    private mailgun: Mailgun;
    private mailgunClient: IMailgunClient;

    constructor() {
        this.mailgun = new Mailgun(formData);
        this.mailgunClient = this.mailgun.client({
            username: 'api',
            key: process.env.MAILGUN_API_KEY || '',
            url: 'https://api.eu.mailgun.net',
        });
    }

    async sendEmail<T extends BaseKafkaMessage>(
        subject: string,
        variables: T,
        template: string = '',
    ) {
        const domain = process.env.MAILGUN_DOMAIN_NAME || '';
        this.mailgunClient.messages
            .create(domain, {
                from: `Debate Zone <reply-me@${domain}>`,
                to: [
                    `${
                        variables.consumerFullName
                            ? variables.consumerFullName
                            : ''
                    } <${variables.consumerEmail}>`,
                ],
                subject: subject,
                template: template,
                'h:X-Mailgun-Variables': JSON.stringify(variables),
            })
            .then(msg => console.info(msg))
            .catch(err => console.error(err));
    }
}

export const mailgunService = new MailgunService();
