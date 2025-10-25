# EmailJS Setup Guide for Contact Form

This guide will walk you through setting up EmailJS to enable your contact form to send emails directly from your website.

## 📋 Prerequisites

- An EmailJS account (free tier available)
- An email service provider (Gmail, Outlook, Yahoo, etc.)
- Access to your website's contact form

## 🚀 Step-by-Step Setup

### 1. Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click "Sign Up" and create your account
3. Verify your email address

### 2. Add Email Service

1. **Login to EmailJS Dashboard**
   - Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
   - Navigate to "Email Services"

2. **Add New Service**
   - Click "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the provider-specific setup instructions

3. **Gmail Setup Example:**
   - Select "Gmail"
   - Enter your Gmail address
   - Click "Connect Account"
   - Authorize EmailJS to access your Gmail
   - Note down the **Service ID** (e.g., `service_xxxxxxx`)

### 3. Create Email Template

1. **Navigate to Templates**
   - Go to "Email Templates" in your dashboard
   - Click "Create New Template"

2. **Template Configuration**
   - **Template Name**: `portfolio_contact_form`
   - **Subject**: `New Contact Form Submission from {{from_name}}`
   - **Content**: Use the HTML template provided below

3. **Template Variables**
   Use these variables in your template:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{timestamp}}` - Submission time
   - `{{website}}` - Website name

4. **Note down the Template ID** (e.g., `template_xxxxxxx`)

### 4. Get Public Key

1. Go to "Account" → "General"
2. Find your **Public Key** (e.g., `user_xxxxxxxxxxxxxxxx`)
3. Copy this key

### 5. Update Your Website Code

Replace the placeholder values in your `Scripts/contact.js` file:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_6m2x21x', // Replace with your actual service ID
    templateID: 'template_rvmi0ko', // Replace with your actual template ID
    publicKey: 'Z4u6SMrODAUc_3s04' // Replace with your actual public key
};
```

Also update the initialization in your HTML file:

```html
<script type="text/javascript">
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); 
</script>
```

## 📧 Beautiful Email Template

Here's a professional HTML email template for your contact form:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .message-box {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 20px 0;
        }
        .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .info-label {
            font-weight: 600;
            color: #667eea;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        .info-value {
            color: #333;
            font-size: 14px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
        }
        .timestamp {
            background: #e3f2fd;
            color: #1976d2;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            margin: 20px 0;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">From: {{website}}</p>
        </div>
        
        <div class="content">
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">👤 Name</div>
                    <div class="info-value">{{from_name}}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">📧 Email</div>
                    <div class="info-value">{{from_email}}</div>
                </div>
            </div>
            
            <div class="info-item">
                <div class="info-label">📝 Subject</div>
                <div class="info-value">{{subject}}</div>
            </div>
            
            <div class="message-box">
                <div class="info-label">💬 Message</div>
                <div style="margin-top: 10px; white-space: pre-wrap;">{{message}}</div>
            </div>
            
            <div class="timestamp">
                <strong>⏰ Received:</strong> {{timestamp}}
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <strong>💡 Quick Actions:</strong><br>
                • Reply directly to this email to respond to {{from_name}}<br>
                • Add {{from_email}} to your contacts<br>
                • Follow up within 24-48 hours for best results
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent from your portfolio contact form.</p>
            <p>Powered by EmailJS | Ashish Ghimire Portfolio</p>
        </div>
    </div>
</body>
</html>
```

## 🔧 Testing Your Setup

1. **Test Email Sending**
   - Fill out your contact form
   - Submit the form
   - Check your email inbox
   - Verify the email template looks correct

2. **Troubleshooting**
   - Check browser console for errors
   - Verify all IDs and keys are correct
   - Ensure EmailJS service is active
   - Check email provider permissions

## 📊 EmailJS Limits (Free Tier)

- **200 emails/month**
- **2 email services**
- **2 email templates**
- **Rate limit**: 200 requests/hour

## 🔒 Security Best Practices

1. **Keep your Public Key secure** - Don't expose it in public repositories
2. **Use environment variables** for production
3. **Enable CORS** if needed
4. **Monitor usage** to avoid hitting limits

## 🎨 Customization Options

### Template Variables Available:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{timestamp}}` - Submission timestamp
- `{{website}}` - Website name
- `{{to_name}}` - Your name
- `{{reply_to}}` - Reply-to email

### Styling Tips:
- Use inline CSS for better email client compatibility
- Test across different email clients
- Keep images optimized and hosted externally
- Use web-safe fonts

## 📞 Support

If you encounter issues:
1. Check EmailJS documentation: [EmailJS Docs](https://www.emailjs.com/docs/)
2. EmailJS support: support@emailjs.com
3. Community forum: [EmailJS Community](https://community.emailjs.com/)

## ✅ Final Checklist

- [ ] EmailJS account created
- [ ] Email service connected
- [ ] Email template created
- [ ] Public key obtained
- [ ] Code updated with correct IDs
- [ ] Form tested successfully
- [ ] Email template customized
- [ ] Error handling implemented

---

**Note**: Replace all placeholder values (`service_xxxxxxx`, `template_xxxxxxx`, `user_xxxxxxxxxxxxxxxx`) with your actual EmailJS credentials before going live.
