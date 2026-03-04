import { env } from "../../env";
import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import { render } from "@react-email/components";
import VerifyEmail from "./mail-components/mail-verification";
export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT ?? 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false }, // self‑signed certs
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const text = htmlToText(html);
  const info = await transporter.sendMail({
    from: `"UniPlan" <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  });
  console.log(info);
  return info;
};

export const sendVerificationEmail = async (
  to: string,
  customerName: string,
  verifyUrl: string,
  expiresIn: Date,
) => {
  const html = await render(
    VerifyEmail({
      customerName,
      verifyUrl,
      expiresIn,
      contactEmail: "contact@yanuu.pl",
    }),
  );
  return await sendEmail(to, "Verify your email address", html);
};
