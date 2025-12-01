import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email.html?token=${token}`;

  await transporter.sendMail({
    from: '"TUTs" <support@tuts.ac.za>',
    to: email,
    subject: "Verify Your TUTs Email",
    html: `
      <h2>Welcome to TUTs!</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationLink}" style="background:#6e56cf;color:white;padding:1rem 2rem;border-radius:50px;text-decoration:none">Verify Email Now</a>
      <p>Link expires in 7 days.</p>
    `
  });
};