import { env } from "../../env";
import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import { render } from "@react-email/components";
import VerifyEmail from "./mail-components/mail-verification";
import CalendarInvite from "./mail-components/calendar-invite";
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

const CONTACT_EMAIL = "contact@yanuu.pl";

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
      contactEmail: CONTACT_EMAIL,
    }),
  );
  return await sendEmail(to, "Verify your email address", html);
};

export const sendCalendarInviteEmail = async (
  to: string,
  inviteeName: string,
  inviterName: string,
  groupName: string,
  inviteLink: string,
  expiresIn?: Date,
) => {
  const html = await render(
    CalendarInvite({
      inviteeName,
      inviterName,
      groupName,
      inviteLink,
      expiresIn,
      contactEmail: CONTACT_EMAIL,
    }),
  );
  return await sendEmail(to, `You are invited to join ${groupName}`, html);
};
