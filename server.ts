import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Notification API
  app.post("/api/notify", async (req, res) => {
    const { email, type, itemName, reportUrl } = req.body;
    
    // In preview mode or without configured env variables, simulate and return success
    if (!process.env.SMTP_HOST) {
        console.log(`[Simulation] Would send email to: ${email}`);
        console.log(`Subject: Your FoundIt ${type} report for ${itemName} has been created`);
        console.log(`Body URL: ${reportUrl}`);
        return res.json({ status: "ok", message: "Simulated email sent" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: '"FoundIt" <noreply@foundit.app>',
        to: email,
        subject: `Your FoundIt ${type} report for ${itemName} has been created`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>Report Created</h2>
            <p>Your ${type} report for <strong>${itemName}</strong> was successfully submitted.</p>
            <p>You can view the details and check the status here:</p>
            <p><a href="${reportUrl}">${reportUrl}</a></p>
          </div>
        `,
      });

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Failed to send email:", error);
      // Return 500 but don't crash app since email notification is best-effort.
      res.status(500).json({ status: "error", message: "Failed to send email" });
    }
  });

  app.post("/api/notify-all", async (req, res) => {
    const { emails, type, itemName, reportUrl, reporterName } = req.body;
    
    if (!process.env.SMTP_HOST) {
        console.log(`[Simulation] Would send email to ALL users: ${emails?.length} recipients`);
        console.log(`Subject: New ${type} item reported: ${itemName}`);
        console.log(`Body URL: ${reportUrl}`);
        return res.json({ status: "ok", message: "Simulated broadcast email sent" });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: '"FoundIt Notifications" <noreply@foundit.app>',
        to: '"FoundIt Users" <noreply@foundit.app>',
        bcc: emails,
        subject: `New ${type} item reported: ${itemName}`,
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2>New ${type === 'lost' ? 'Lost' : 'Found'} Item</h2>
            <p>A new ${type} item <strong>${itemName}</strong> was just reported by ${reporterName || 'a user'}.</p>
            <p>You can view the details here:</p>
            <p><a href="${reportUrl}">${reportUrl}</a></p>
          </div>
        `,
      });

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Failed to send broadcast email:", error);
      res.status(500).json({ status: "error", message: "Failed to send broadcast email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
