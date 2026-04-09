import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,  // App Password của Gmail
    },
})
transporter.verify((error, success) => {
    if (error) {
        console.error('Mailer error:', error)
    } else {
        console.log('Mailer ready ✅')
    }
})
export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`

    await transporter.sendMail({
        from: `"Course Management" <${process.env.MAIL_USER}>`,
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