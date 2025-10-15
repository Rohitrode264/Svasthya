import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendMail(to: string, subject: string, text: string, context:string) {
  try {
    await transporter.sendMail({
      from: `"Svasthya - ${context}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html:text
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
}
