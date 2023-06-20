import Mailgun from 'mailgun.js';
import { IMailgunClient } from 'mailgun.js/Interfaces';
const formData = require('form-data');

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

    async sendEmail(
        email: string,
        subject: string,
        body: string,
        fullName?: string,
    ) {
        const domain = process.env.MAILGUN_DOMAIN_NAME || '';
        this.mailgunClient.messages
            .create(domain, {
                from: `Debate Zone <no-reply@${domain}>`,
                to: [`${fullName} <${email}>`],
                subject: subject,
                text: body,
            })
            .then(msg => console.info(msg))
            .catch(err => console.error(err));
    }
}

export const mailgunService = new MailgunService();
