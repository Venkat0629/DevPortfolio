interface ContactEmailPayload {
  name: string;
  email: string;
  recipientEmail: string;
  subject: string;
  message: string;
  portfolioUrl?: string;
  contactPageUrl?: string;
}

function getEnv(
  name:
  | 'VITE_EMAILJS_SERVICE_ID'
  | 'VITE_EMAILJS_CONTACT_TEMPLATE_ID'
  | 'VITE_EMAILJS_ACK_TEMPLATE_ID'
  | 'VITE_EMAILJS_TEMPLATE_ID'
  | 'VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID'
  | 'VITE_EMAILJS_PUBLIC_KEY'
): string {
  return import.meta.env[name]?.trim() ?? '';
}

export function isEmailDeliveryConfigured(): boolean {
  return Boolean(
    getEnv('VITE_EMAILJS_SERVICE_ID')
    && getContactTemplateId()
    && getEnv('VITE_EMAILJS_PUBLIC_KEY')
  );
}

function getContactTemplateId(): string {
  return getEnv('VITE_EMAILJS_CONTACT_TEMPLATE_ID') || getEnv('VITE_EMAILJS_TEMPLATE_ID');
}

function getAcknowledgementTemplateId(): string {
  return getEnv('VITE_EMAILJS_ACK_TEMPLATE_ID') || getEnv('VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID');
}

async function sendWithTemplate(templateId: string, payload: ContactEmailPayload): Promise<void> {
  const serviceId = getEnv('VITE_EMAILJS_SERVICE_ID');
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
        visitor_name: payload.name,
        visitor_email: payload.email,
        original_subject: payload.subject,
        original_message: payload.message,
        portfolio_url: payload.portfolioUrl ?? '',
        contact_page_url: payload.contactPageUrl ?? '',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Email delivery failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`);
  }
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  await sendWithTemplate(getContactTemplateId(), payload);
}

export async function sendAutoReplyEmail(payload: ContactEmailPayload): Promise<void> {
  const acknowledgementTemplateId = getAcknowledgementTemplateId();
  if (!acknowledgementTemplateId) {
    return;
  }
  await sendWithTemplate(acknowledgementTemplateId, payload);
}
