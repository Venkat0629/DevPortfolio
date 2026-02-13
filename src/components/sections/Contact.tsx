import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Section, Card, CardContent, Button, Input, Textarea, useToast } from '@/components/ui';
import { fadeInLeft, fadeInRight } from '@/lib/animations';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function Contact() {
  const { contact, personal } = usePortfolio();
  const { ref, isVisible } = useScrollReveal();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      addToast({
        type: 'success',
        title: 'Message Sent!',
        message: contact.successMessage,
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      addToast({
        type: 'error',
        title: 'Failed to Send',
        message: contact.errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Section
      id="contact"
      title={contact.title}
      subtitle={contact.subtitle}
      className="bg-gray-50/50 dark:bg-gray-900/30"
    >
      <div ref={ref} className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            {contact.description}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Email</h3>
                <a
                  href={`mailto:${personal.email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {personal.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Phone</h3>
                <a
                  href={`tel:${personal.phone}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {personal.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Location</h3>
                <p className="text-gray-600 dark:text-gray-400">{personal.location}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          <Card variant="glass" glow>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label={contact.formFields.name.label}
                  placeholder={contact.formFields.name.placeholder}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  required={contact.formFields.name.required}
                  disabled={isSubmitting}
                />

                <Input
                  type="email"
                  label={contact.formFields.email.label}
                  placeholder={contact.formFields.email.placeholder}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  required={contact.formFields.email.required}
                  disabled={isSubmitting}
                />

                <Input
                  label={contact.formFields.subject.label}
                  placeholder={contact.formFields.subject.placeholder}
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  error={errors.subject}
                  required={contact.formFields.subject.required}
                  disabled={isSubmitting}
                />

                <Textarea
                  label={contact.formFields.message.label}
                  placeholder={contact.formFields.message.placeholder}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  error={errors.message}
                  required={contact.formFields.message.required}
                  disabled={isSubmitting}
                  rows={5}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                  rightIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Sending...' : contact.submitText}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
}
