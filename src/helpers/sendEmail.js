import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email_user,
    pass: process.env.email_pass,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Xushvaqtov Sardor" <${process.env.email_user}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

export { transporter };
