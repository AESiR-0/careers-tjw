import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const positionId = formData.get('positionId') as string;
    const resume = formData.get('resume') as File | null;

    // Validate required fields
    if (!email || !phone || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: email, phone, and position are required' },
        { status: 400 }
      );
    }

    // Get SMTP configuration from environment variables
    // Support both SMTP_PASS and SMTP_PASSWORD for compatibility
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;
    
    // Try to get recipient email, fallback to a default
    // Priority: SMTP_TO > ADMIN_EMAIL > SMTP_FROM > SMTP_USER > info@thejaayveeworld.com
    const smtpTo = process.env.SMTP_TO || 
                   process.env.ADMIN_EMAIL || 
                   process.env.SMTP_FROM || 
                   smtpUser || 
                   'info@thejaayveeworld.com';

    if (!smtpHost || !smtpUser || !smtpPassword) {
      console.error('❌ SMTP configuration missing:', {
        hasHost: !!smtpHost,
        hasUser: !!smtpUser,
        hasPassword: !!smtpPassword,
        envKeys: {
          SMTP_HOST: !!process.env.SMTP_HOST,
          SMTP_PORT: !!process.env.SMTP_PORT,
          SMTP_USER: !!process.env.SMTP_USER,
          SMTP_PASS: !!process.env.SMTP_PASS,
          SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
        }
      });
      return NextResponse.json(
        { success: false, error: 'Email service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Validate recipient email
    if (!smtpTo || !smtpTo.includes('@')) {
      console.error('❌ Invalid recipient email:', {
        smtpTo,
        envKeys: {
          SMTP_TO: !!process.env.SMTP_TO,
          ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
          SMTP_FROM: !!process.env.SMTP_FROM,
          SMTP_USER: !!smtpUser,
        }
      });
      return NextResponse.json(
        { success: false, error: 'Recipient email not configured. Please set SMTP_TO or ADMIN_EMAIL environment variable.' },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Prepare email content
    const isNewRole = position === "new-role";
    const emailSubject = isNewRole 
      ? "New Role Application - General Interest" 
      : `New Job Application: ${position}`;
    const emailText = `
${isNewRole ? "New Role Application Received" : "New Job Application Received"}

Position: ${isNewRole ? "General Application (Role Not Listed)" : position}
Position ID: ${positionId}
Email: ${email}
Phone: ${phone}

Application submitted at: ${new Date().toLocaleString()}
    `.trim();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
          ${isNewRole ? "New Role Application Received" : "New Job Application Received"}
        </h2>
        <div style="margin-top: 20px;">
          <p><strong>Position:</strong> ${isNewRole ? "General Application (Role Not Listed)" : position}</p>
          <p><strong>Position ID:</strong> ${positionId}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
          <p><strong>Application Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `.trim();

    // Prepare attachments if resume is provided
    const attachments = [];
    if (resume && resume.size > 0) {
      const buffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({
        filename: resume.name,
        content: buffer,
      });
    }

    // Send email
    const mailOptions = {
      from: smtpFrom || `info@thejaayveeworld.com`,
      to: smtpTo,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      messageId: info.messageId,
    });

  } catch (error: any) {
    console.error('❌ Error submitting job application:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit application. Please try again later.',
      },
      { status: 500 }
    );
  }
}

