import nodemailer from "nodemailer";
import config from "./config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.NODEMAILER_GMAIL, // your Gmail address
    pass: config.NODEMAILER_PASSWORD, // Gmail App Password
  },
});

export const sendMail = async ({
  subject,
  content,
  emailTo,
}: {
  subject: string;
  content: string;
  emailTo: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `Bulsujuans <${config.NODEMAILER_GMAIL}>`,
      to: emailTo,
      subject,
      html: content,
    });

    console.log("Email sent via Gmail:", info.messageId);
    return true;
  } catch (error) {
    console.error("Gmail email error:", error);
    return false;
  }
};
