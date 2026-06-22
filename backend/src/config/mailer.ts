import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { env } from './env.js';
import { logger } from './logger.js';
import { AppError } from '../utils/AppError.js';

const mailUser = env.MAIL_USER
const mailPass = env.MAIL_PASS

export const isMailerConfigured = (): boolean => Boolean(mailUser && mailPass)

if (!isMailerConfigured()) {
    logger.warn('Mailer disabled: MAIL_USER or MAIL_PASS is missing.')
}

const transporter: Transporter | null = isMailerConfigured()
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailUser,
            pass: mailPass,
        },
    })
    : null

if (transporter) {
    transporter.verify((error) => {
        if (error) {
            logger.error({ error }, 'Mailer verification failed')
        } else {
            logger.info('Mailer ready')
        }
    })
}

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
    if (!transporter || !isMailerConfigured()) {
        throw new AppError('Email service is not configured', 503);
    }

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`

    try {
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
    } catch (error) {
        logger.error({ error, email }, 'Failed to send reset password email')
        throw new AppError('Unable to send reset password email. Please try again later.', 503);
    }
}
