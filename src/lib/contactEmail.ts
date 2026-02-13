interface ContactEmailPayload {
  name: string;
  email: string;
  recipientEmail: string;
  subject: string;
  message: string;
}

function getEnv(name: 'VITE_EMAILJS_SERVICE_ID' | 'VITE_EMAILJS_TEMPLATE_ID' | 'VITE_EMAILJS_PUBLIC_KEY'): string {
  return import.meta.env[name]?.trim() ?? '';
}

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(
    getEnv('VITE_EMAILJS_SERVICE_ID')
    && getEnv('VITE_EMAILJS_TEMPLATE_ID')
    && getEnv('VITE_EMAILJS_PUBLIC_KEY')
  );
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID');
  const templateId = getEnv('VITE_EMAILJS_TEMPLATE_ID');
  const publicKey = getEnv('VITE_EMAILJS_PUBLIC_KEY');

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Email service is not configured.');
  }

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: payload.name,
        from_email: payload.email,
        to_email: payload.recipientEmail,
        reply_to: payload.email,
        subject: payload.subject,
        message: payload.message,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed with status ${response.status}`);
  }
}
