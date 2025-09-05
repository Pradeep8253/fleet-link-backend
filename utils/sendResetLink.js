import nodemailer from "nodemailer";

const makeTransport = () => {
  if (process.env.MAIL_PROVIDER !== "gmail") return null;
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const resetEmailHtml = ({ url }) => `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
    <h2>Password reset request</h2>
    <p>You (or someone else) requested to reset your password.</p>
    <p>Click the button below within <b>15 minutes</b> to set a new password:</p>
    <p style="margin:24px 0">
      <a href="${url}" style="background:#111;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">
        Reset Password
      </a>
    </p>
    <p>If the button doesn’t work, copy and paste this link:</p>
    <p style="word-break:break-all;color:#555">${url}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
    <p style="color:#888;font-size:12px">If you didn’t request this, you can ignore this email.</p>
  </div>
`;

export const sendResetLink = async ({ to, url }) => {
  const transporter = makeTransport();
  const from = process.env.MAIL_FROM || process.env.GMAIL_USER;

  if (!transporter) {
    console.log("[Email NOT configured] Reset URL:", url);
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    html: resetEmailHtml({ url }),
  });
};
