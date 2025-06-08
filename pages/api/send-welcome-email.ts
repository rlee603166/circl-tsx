import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, referralCode } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const emailContent = {
      to: email,
      subject: 'Welcome to Circl - You\'re on the Waitlist! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Circl</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #000000;
                max-width: 650px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
                font-size: 16px;
              }
              .container {
                background-color: white;
                border-radius: 12px;
                padding: 50px;
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 40px;
              }
              .logo-container {
                display: inline-flex;
                align-items: center;
                margin-bottom: 20px;
              }
              .logo-text {
                font-size: 48px;
                font-weight: bold;
                color: #000000;
                letter-spacing: -0.5px;
              }
              h1 {
                color: #000000;
                font-size: 32px;
                font-weight: 300;
                margin-bottom: 25px;
                text-align: center;
              }
              p {
                font-size: 18px;
                line-height: 1.7;
                margin-bottom: 20px;
                color: #000000;
              }
              .button {
                display: inline-block;
                padding: 16px 40px;
                background-color: #7c3aed !important;
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 30px;
                margin: 25px 0;
                font-size: 18px;
                font-weight: 500;
                transition: all 0.3s ease;
              }
              .button:hover {
                background-color: #6d28d9 !important;
                transform: translateY(-1px);
              }
              .referral-box {
                background-color: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
              }
              .referral-box h3 {
                font-size: 22px;
                margin-bottom: 15px;
                color: #000000;
              }
              .referral-link {
                font-family: monospace;
                font-size: 16px;
                color: #7c3aed;
                word-break: break-all;
                margin: 15px 0;
                background-color: white;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
              }
              .footer {
                text-align: center;
                margin-top: 50px;
                font-size: 16px;
                color: #666666;
              }
              .benefits {
                background-color: #faf5ff;
                border-left: 4px solid #7c3aed;
                padding: 30px;
                margin: 30px 0;
                border-radius: 8px;
              }
              .benefits h3 {
                color: #7c3aed;
                margin-top: 0;
                font-size: 22px;
                margin-bottom: 15px;
              }
              .benefits ul {
                margin: 15px 0;
                padding-left: 25px;
              }
              .benefits li {
                margin: 12px 0;
                font-size: 17px;
                color: #000000;
              }
              ul {
                margin: 20px 0;
                padding-left: 25px;
              }
              li {
                margin: 12px 0;
                font-size: 17px;
                color: #000000;
              }
              strong {
                color: #000000;
              }
              
              /* Mobile responsiveness */
              @media only screen and (max-width: 600px) {
                .container {
                  padding: 30px 20px;
                }
                h1 {
                  font-size: 26px;
                }
                p, li {
                  font-size: 16px;
                }
                .button {
                  padding: 14px 30px;
                  font-size: 16px;
                }
                .logo-text {
                  font-size: 36px;
                }
                .benefits, .referral-box {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo-container">
                  <!-- Option 1: Use hosted image (recommended) -->
                  <!-- <img src="https://usecircl.com/circl-logo.png" alt="Circl" style="width: 40px; height: 40px; margin-right: 8px; vertical-align: middle;" /> -->
                  
                  <!-- Option 2: CSS fallback (current) -->
                  <div class="logo-text">CIRCL</div>
                </div>
              </div>
              
              <h1>Welcome to the Circl Waitlist! 🎉</h1>
              
              <p>Hi there,</p>
              
              <p>Thanks for signing up! Circl is rethinking how professionals explore networks and careers. We're thrilled to have you as one of our early supporters!</p>
              
              <div class="benefits">
                <h3>What to Expect</h3>
                <ul>
                  <li><strong>Priority Access:</strong> As a waitlist member, you'll be among the first to try Circl</li>
                  <li><strong>Exclusive Updates:</strong> We'll keep you informed about our progress and new features</li>
                  <li><strong>Referral Rewards:</strong> Invite friends to move up the waitlist and unlock special perks</li>
                </ul>
              </div>
              
              ${referralCode ? `
              <div class="referral-box">
                <h3>🚀 Move Up the Waitlist!</h3>
                <p style="margin-bottom: 15px;">Share your unique referral link with friends:</p>
                <div class="referral-link">https://usecircl.com/ref/${referralCode}</div>
                <p style="font-size: 16px; color: #6b7280; margin-top: 15px;">
                  For every friend who joins using your link, you'll move up in the queue!
                </p>
              </div>
              ` : ''}
              
              <p>We're working hard to build something special, and we can't wait to share it with you. In the meantime, here's what you can expect:</p>
              
              <ul>
                <li>See how professionals move through industries and roles</li>
                <li>Reveal hidden connections in your network</li>
                <li>Explore your network like a map — dynamic, not static</li>
                <li>Ask anything, get answers — powered by network intelligence</li>
              </ul>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="https://usecircl.com" class="button">Visit Our Website</a>
              </div>
              
              <p>Have questions? Just reply to this email - we'd love to hear from you!</p>
              
              <p>Best regards,<br><strong>The Circl Team</strong></p>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Circl. All rights reserved.</p>
                <p style="font-size: 14px; margin-top: 10px;">
                  You're receiving this email because you signed up for the Circl waitlist.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Welcome to the Circl Waitlist! 🎉

Hi there,

Thanks for signing up! Circl is rethinking how professionals explore networks and careers. We're thrilled to have you as one of our early supporters!

What to Expect
- Priority Access: As a waitlist member, you'll be among the first to try Circl
- Exclusive Updates: We'll keep you informed about our progress and new features
- Referral Rewards: Invite friends to move up the waitlist and unlock special perks

${referralCode ? `
🚀 Move Up the Waitlist!
Share your unique referral link with friends:
https://usecircl.com/ref/${referralCode}

For every friend who joins using your link, you'll move up in the queue!
` : ''}

We're working hard to build something special, and we can't wait to share it with you. In the meantime, here's what you can expect:

- See how professionals move through industries and roles
- Spot hidden transitions, pivots, and upward paths
- Explore your network like a map — dynamic, not static
- Ask anything, get answers — powered by network intelligence

Visit our website: https://usecircl.com

Have questions? Just reply to this email - we'd love to hear from you!

Best regards,
The Circl Team

© ${new Date().getFullYear()} Circl. All rights reserved.
You're receiving this email because you signed up for the Circl waitlist.
      `
    };

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'Circl <onboarding@resend.dev>',
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    console.log('Welcome email sent successfully:', data);

    return res.status(200).json({ 
      success: true, 
      message: 'Welcome email sent successfully',
      email: email,
      emailData: data
    });

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return res.status(500).json({ 
      error: 'Failed to send welcome email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 