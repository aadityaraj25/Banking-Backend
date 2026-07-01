import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Hirex Team" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const sendRegisterEmail = async (userEmail, name) => {
    const subject = "Welcome to Hirex!";

    const text = `
                Hi ${name},
                Welcome to Hirex!
                Your account has been created successfully.
                We're excited to have you on board. You can now log in and start exploring the platform.
                If you have any questions or need assistance, feel free to contact us.
                
                Best Regards,
                The Hirex Team
                `;

    const html = `
                <h2>Welcome to Hirex!</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>Thank you for registering with <strong>Hirex</strong>.</p>
                <p>Your account has been created successfully.</p>
                <p>You can now log in and start exploring the platform.</p>
                <p>If you have any questions or need assistance, feel free to contact us.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The Hirex Team</strong></p>
                `;

    await sendEmail(userEmail, subject, text, html);
};

export const sendTransactionEmail = async (userEmail, name, amount, transactionDetails) => {
    const subject = "Transaction Notification";
    const text = `
                Hi ${name},
                A transaction has been made from your account.
                Transaction Details:
                - From Account: ${transactionDetails.fromAccount}
                - To Account: ${transactionDetails.toAccount}
                - Amount: ${transactionDetails.amount}
                - Status: ${transactionDetails.status}
                
                If you did not authorize this transaction, please contact our support team immediately.
                
                Best Regards,
                The Hirex Team
                `;

    const html = `
                <h2>Transaction Notification</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>A transaction has been made from your account.</p>
                <h3>Transaction Details:</h3>
                <ul>
                    <li><strong>From Account:</strong> ${transactionDetails.fromAccount}</li>
                    <li><strong>To Account:</strong> ${transactionDetails.toAccount}</li>
                    <li><strong>Amount:</strong> ${transactionDetails.amount}</li>
                    <li><strong>Status:</strong> ${transactionDetails.status}</li>
                </ul>
                <p>If you did not authorize this transaction, please contact our support team immediately.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The Hirex Team</strong></p>
                `;

    await sendEmail(userEmail, subject, text, html);
};

export const  sendTransactionFailureEmail = async (userEmail, name, amount, transactionDetails) => {
    const subject = "Transaction Failure Notification";
    const text = `
                Hi ${name},
                We regret to inform you that a transaction from your account has failed.
                Transaction Details:
                - From Account: ${transactionDetails.fromAccount}
                - To Account: ${transactionDetails.toAccount}
                - Amount: ${transactionDetails.amount}
                - Status: ${transactionDetails.status}
                
                Please review the transaction details and try again. If you need assistance, feel free to contact our support team.
                
                Best Regards,
                The Hirex Team
                `;

    const html = `
                <h2>Transaction Failure Notification</h2>
                <p>Hi <strong>${name}</strong>,</p>
                <p>We regret to inform you that a transaction from your account has failed.</p>
                <h3>Transaction Details:</h3>
                <ul>
                    <li><strong>From Account:</strong> ${transactionDetails.fromAccount}</li>
                    <li><strong>To Account:</strong>  ${transactionDetails.toAccount}</li>
                    <li><strong>Amount:</strong> ${transactionDetails.amount}</li>
                    <li><strong>Status:</strong> ${transactionDetails.status}</li>
                </ul>
                <p>Please review the transaction details and try again. If you need assistance, feel free to contact our support team.</p>
                <br/>
                <p>Best Regards,</p>
                <p><strong>The Hirex Team</strong></p>
                `;

    await sendEmail(userEmail, subject, text, html);
};