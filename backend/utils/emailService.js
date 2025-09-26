import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Konfigurasi transporter email
const createTransporter = () => {
  // Debug: Check if environment variables are loaded
  console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "NOT SET");
  console.log(
    "EMAIL_PASS:",
    process.env.EMAIL_PASS
      ? "Set (length: " + process.env.EMAIL_PASS.length + ")"
      : "NOT SET"
  );

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials not found in environment variables");
  }

  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password untuk Gmail
    },
    tls: {
      rejectUnauthorized: false,
    },
    debug: true, // Enable debug output
    logger: true, // Log information in console
  });
};

// Fungsi untuk mengirim email verifikasi
export const sendVerificationEmail = async (
  email,
  username,
  verificationToken
) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - MERN E-Commerce",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #ec4899; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .button { 
            display: inline-block; 
            background-color: #ec4899; 
            color: white; 
            padding: 12px 30px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0; 
          }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to MERN E-Commerce!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #ec4899;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2023 MERN E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Fungsi untuk mengirim invoice PDF
export const sendInvoiceEmail = async (email, username, orderId, pdfBuffer) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Invoice for Order #${orderId} - MERN E-Commerce`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #ec4899; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thank you for your purchase! Your payment has been successfully processed.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p>Please find your invoice attached to this email.</p>
            <p>We appreciate your business and hope you enjoy your purchase!</p>
          </div>
          <div class="footer">
            <p>&copy; 2023 MERN E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    attachments: [
      {
        filename: `invoice-${orderId}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Invoice email sent successfully");
  } catch (error) {
    console.error("Error sending invoice email:", error);
    throw error;
  }
};

// Fungsi untuk mengirim email persetujuan vendor
export const sendVendorApprovalEmail = async (
  email,
  businessName,
  username
) => {
  const transporter = createTransporter();

  const dashboardUrl = `${process.env.FRONTEND_URL}/vendor/dashboard`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "🎉 Congratulations! Your Vendor Application Has Been Approved",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Marketplace!</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${username},</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Congratulations! We're excited to inform you that your vendor application for 
            <strong>${businessName}</strong> has been approved! 🎉
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Access your vendor dashboard</li>
              <li>Set up your business profile</li>
              <li>Start adding your products</li>
              <li>Manage your inventory and orders</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;">
              Access Vendor Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <p style="margin-bottom: 0;">
            Best regards,<br>
            <strong>The Marketplace Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Vendor approval email sent successfully");
  } catch (error) {
    console.error("Error sending vendor approval email:", error);
    throw error;
  }
};

// Fungsi untuk mengirim email penolakan vendor
export const sendVendorRejectionEmail = async (
  email,
  businessName,
  username,
  reason
) => {
  const transporter = createTransporter();

  const reapplyUrl = `${process.env.FRONTEND_URL}/become-vendor`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Vendor Application Update - Action Required",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Application Update</h1>
        </div>
        
        <div style="padding: 30px; background-color: #f9f9f9; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${username},</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for your interest in becoming a vendor on our marketplace. 
            After careful review, we regret to inform you that your application for 
            <strong>${businessName}</strong> has not been approved at this time.
          </p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f5576c;">
            <h3 style="color: #f5576c; margin-top: 0;">Feedback:</h3>
            <p style="margin: 0; color: #666;">
              ${
                reason ||
                "Please review our vendor requirements and consider reapplying with additional documentation."
              }
            </p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #667eea; margin-top: 0;">Don't Give Up!</h3>
            <p style="margin: 0;">
              You're welcome to address the feedback above and reapply. We encourage you to 
              review our vendor guidelines and submit a new application when you're ready.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${reapplyUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold; 
                      display: inline-block;">
              Apply Again
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions about this decision or need clarification, 
            please contact our support team.
          </p>
          
          <p style="margin-bottom: 0;">
            Best regards,<br>
            <strong>The Marketplace Team</strong>
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Vendor rejection email sent successfully");
  } catch (error) {
    console.error("Error sending vendor rejection email:", error);
    throw error;
  }
};
