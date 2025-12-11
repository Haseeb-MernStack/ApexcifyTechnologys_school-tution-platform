import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.SMTP_HOST) return; // noop in dev if not configured

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@apexschool.local",
    ...options,
  });
}
