import { SES as AWSSES } from 'aws-sdk';
import { Settings } from '../settings';

export class SES {
  private ses = new AWSSES();

  public async sendNewCustomerEmail (receiver: string, customerName: string, token: string): Promise<boolean> {
    return !! await this.ses.sendEmail(<AWSSES.SendEmailRequest>{
      Destination: {
        ToAddresses: [receiver],
        CcAddresses: [Settings.emailSender],
        BccAddresses: [],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `your customer name: ${customerName}.\nYour secret token: ${token}.`.replace(/\n/g, '<br/>'),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: 'Registration of Real-Time-Fitness-Monitoring(rtfm) Service',
        },
      },
      Source: Settings.emailSender,
    }).promise();
  }

  public async sendNewUserEmail (receiver: string, username: string, password: string): Promise<boolean> {
    return !! await this.ses.sendEmail(<AWSSES.SendEmailRequest>{
      Destination: {
        ToAddresses: [receiver],
        CcAddresses: [Settings.emailSender],
        BccAddresses: [],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `your username: ${username}.\nYour one-time-password: ${password}.\n Please login to change your password as soon as possible`.replace(/\n/g, '<br/>'),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: 'Registration of Real-Time-Fitness-Monitoring(rtfm) User Account',
        },
      },
      Source: Settings.emailSender,
    }).promise();
  }
}
