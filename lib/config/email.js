import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const ALLOWED_TEST_EMAIL = 'shangeshsixisvv@gmail.com';

export async function sendEmail({ to, subject, html }) {
    try {
        // In development, always send to the allowed test email
        const targetEmail = process.env.NODE_ENV === 'production' ? to : ALLOWED_TEST_EMAIL;

        const data = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: targetEmail,
            subject,
            html,
            // If in development and sending to a different email, add it to the reply-to
            ...(process.env.NODE_ENV !== 'production' && to !== ALLOWED_TEST_EMAIL && {
                reply_to: to
            })
        });
        return data;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
} 