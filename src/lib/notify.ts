/**
 * Send email notification when someone joins the waitlist
 * Supports multiple email providers via environment variables
 */

interface NotificationOptions {
  email: string;
  totalCount: number;
}

export async function notifyNewSignup(
  options: NotificationOptions
): Promise<boolean> {
  const { email, totalCount } = options;

  // Check if notifications are enabled
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!notifyEmail) {
    console.log("Notifications disabled - NOTIFY_EMAIL not set");
    return false;
  }

  try {
    // Option 1: Use Resend (recommended)
    if (process.env.RESEND_API_KEY) {
      return await notifyViaResend(email, totalCount, notifyEmail);
    }

    // Option 2: Use SendGrid
    if (process.env.SENDGRID_API_KEY) {
      return await notifyViaSendGrid(email, totalCount, notifyEmail);
    }

    // Option 3: Use SMTP (generic)
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      return await notifyViaSMTP(email, totalCount, notifyEmail);
    }

    console.warn(
      "No email provider configured. Set RESEND_API_KEY, SENDGRID_API_KEY, or SMTP credentials."
    );
    return false;
  } catch (error) {
    console.error("Error sending notification email:", error);
    return false;
  }
}

async function notifyViaResend(
  newEmail: string,
  totalCount: number,
  notifyEmail: string
): Promise<boolean> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
        to: notifyEmail,
        subject: `🎉 New Waitlist Signup - Total: ${totalCount}`,
        html: `
          <h2>New Waitlist Signup!</h2>
          <p><strong>Email:</strong> ${newEmail}</p>
          <p><strong>Total Waitlist Count:</strong> ${totalCount}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending via Resend:", error);
    return false;
  }
}

async function notifyViaSendGrid(
  newEmail: string,
  totalCount: number,
  notifyEmail: string
): Promise<boolean> {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: notifyEmail }],
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || "noreply@example.com",
        },
        subject: `🎉 New Waitlist Signup - Total: ${totalCount}`,
        content: [
          {
            type: "text/html",
            value: `
              <h2>New Waitlist Signup!</h2>
              <p><strong>Email:</strong> ${newEmail}</p>
              <p><strong>Total Waitlist Count:</strong> ${totalCount}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            `,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SendGrid API error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending via SendGrid:", error);
    return false;
  }
}

async function notifyViaSMTP(
  newEmail: string,
  totalCount: number,
  notifyEmail: string
): Promise<boolean> {
  // For SMTP, you would need to install nodemailer
  // This is a placeholder - you can implement it if needed
  console.log(
    `SMTP notification would be sent to ${notifyEmail} about ${newEmail}`
  );
  console.warn(
    "SMTP notifications require nodemailer. Install it with: npm install nodemailer @types/nodemailer"
  );
  return false;
}

