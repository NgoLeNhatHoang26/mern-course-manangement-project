import nodemailer from 'nodemailer'
import { env } from './env.js';
import { logger } from './logger.js';

const mailUser = env.MAIL_USER
const mailPass = env.MAIL_PASS

if (!mailUser || !mailPass) {
    logger.warn('Mailer disabled: MAIL_USER or MAIL_PASS is missing.')
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: mailUser,
        pass: mailPass,  
    },
})
transporter.verify((error, success) => {
    if (error) {
        logger.error({ error }, 'Mailer error')
    } else {
        logger.info('Mailer ready')
    }
})
export const sendResetPasswordEmail = async (email: string, token: string) => {
    if (!mailUser || !mailPass) {
        throw new Error('Mailer is not configured. Please set MAIL_USER and MAIL_PASS.')
    }

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`

    await transporter.sendMail({
        from: `"Course Management" <${mailUser}>`,
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Đặt lại mật khẩu</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Click vào link bên dưới:</p>
        <a href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          "
        >
          Đặt lại mật khẩu
        </a>
        <p>Link có hiệu lực trong <strong>15 phút</strong>.</p>
        <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
      </div>
    `,
    })
}