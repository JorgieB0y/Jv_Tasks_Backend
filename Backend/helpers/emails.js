import nodemailer from 'nodemailer';

export const registrationEmail = async (data) => {
    const { email, name, token } = data;

      // Mailtrap.io config
      const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

    // Email information
    const info = await transport.sendMail({
        from: '"JV Tasks - Adminstrate your projects <admin@jvtasks.com>"',
        to: email,
        subject: "JV Tasks - Confirm your Account",
        text: "Confirm your account",
        html: `
            <p>Hello ${name}, please confirm your account on JV Tasks</p>
            
            <p> Your account is almost up and ready! just press the link bellow to confirm your email address:</p>
            
            <a href="${process.env.FRONTEND_URL}/confirm/${token}"> Confrim Account </a>

            <p> If you did not make this account, please ignore this message. </p>
        `
    })
}

export const passwordResetEmail = async (data) => {
  const { email, name, token } = data;

  // Mailtrap.io config
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

  // Email information
  const info = await transport.sendMail({
      from: '"JV Tasks - Adminstrate your projects <admin@jvtasks.com>"',
      to: email,
      subject: "JV Tasks - Reset Account Password",
      text: "Reset your JV Tasks' password",
      html: `
          <p>Hello ${name}, please set a new password on JV Tasks</p>
          
          <p> Please follow the link bellow to reset your account password:</p>
          
          <a href="${process.env.FRONTEND_URL}/forgot-password/${token}"> Change Password </a>

          <p> If you did request this email you can ignore this message. </p>
      `
  })
}