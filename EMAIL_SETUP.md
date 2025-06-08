# Email Setup Guide for Circl Waitlist

This guide will help you set up automated welcome emails for your waitlist signups.

## Email Service Options

You can choose from several email service providers. Here are the most popular options:

### Option 1: Resend (Recommended for startups)

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Create an account (free tier includes 3,000 emails/month)

2. **Install Resend SDK**
   ```bash
   npm install resend
   ```

3. **Get your API key**
   - In Resend dashboard, go to API Keys
   - Create a new API key
   - Add it to your `.env.local` file:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

4. **Update the API route**
   Replace the TODO section in `pages/api/send-welcome-email.ts`:
   ```typescript
   import Resend from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   // In the try block, replace the TODO with:
   await resend.emails.send({
     from: 'Circl <welcome@your-domain.com>',
     to: emailContent.to,
     subject: emailContent.subject,
     html: emailContent.html,
     text: emailContent.text,
   });
   ```

5. **Verify your domain**
   - In Resend dashboard, add and verify your domain
   - Follow their DNS setup instructions

### Option 2: SendGrid

1. **Sign up for SendGrid**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Create an account (free tier includes 100 emails/day)

2. **Install SendGrid SDK**
   ```bash
   npm install @sendgrid/mail
   ```

3. **Get your API key**
   - In SendGrid dashboard, go to Settings > API Keys
   - Create a new API key with full access
   - Add it to your `.env.local` file:
   ```
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
   ```

4. **Update the API route**
   Replace the TODO section in `pages/api/send-welcome-email.ts`:
   ```typescript
   import sgMail from '@sendgrid/mail';
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
   
   // In the try block, replace the TODO with:
   await sgMail.send({
     to: emailContent.to,
     from: 'welcome@your-domain.com',
     subject: emailContent.subject,
     html: emailContent.html,
     text: emailContent.text,
   });
   ```

### Option 3: Supabase Email (If using Supabase Auth)

If you're already using Supabase Auth, you can use their built-in email functionality:

1. **Enable email in Supabase**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > Email Templates
   - You can customize email templates there

2. **Use Supabase Edge Functions**
   Instead of the Next.js API route, you could modify your existing `join-waitlist` edge function to send emails using Supabase's email service.

## Testing Your Email Setup

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Sign up for the waitlist**
   - Go to your local site
   - Click "Get Started" or "Join Waitlist"
   - Enter an email address
   - Submit the form

3. **Check the console**
   - You should see "Welcome email sent successfully" in the browser console
   - Check your server logs for any errors

4. **Verify email delivery**
   - Check the inbox (and spam folder) of the email you used
   - Ensure the email looks correct and all links work

## Environment Variables Summary

Add these to your `.env.local` file (don't commit this file):

```bash
# For Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# OR for SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Your existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Emails not sending
- Check your API key is correct
- Verify your domain is set up properly
- Check the API service dashboard for any errors
- Look at your server logs

### Emails going to spam
- Ensure you've verified your sending domain
- Use a proper "from" address with your domain
- Avoid spam trigger words in subject/content
- Set up SPF, DKIM, and DMARC records

### Rate limiting
- Most services have rate limits on free tiers
- Consider upgrading if you expect high volume
- Implement retry logic for failed sends

## Next Steps

1. Choose an email service provider
2. Set up your account and get API credentials
3. Update the API route with actual sending code
4. Test thoroughly before deploying
5. Monitor email delivery rates in production

For production, consider:
- Setting up email analytics
- Creating email templates for consistency
- Implementing unsubscribe functionality
- Adding email queuing for reliability 