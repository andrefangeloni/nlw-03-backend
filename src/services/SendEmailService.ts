import nodemailer, { Transporter } from 'nodemailer';

interface Mail {
  to: string;
  subject: string;
  body: string;
}

class SendEmailService {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  async execute({ to, subject, body }: Mail) {
    const message = await this.client.sendMail({
      to,
      subject,
      html: body,
      from: 'NPS <noreply@nps.com.br>',
    });

    console.log('Message sent: ', message.messageId);
    console.log('Preview URL: ', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendEmailService();
