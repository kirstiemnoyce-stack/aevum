import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function PrivacyScreen() {
  const navigate = useNavigate();
  const { getPrimaryColor } = useSettings();
  const primary = getPrimaryColor();

  return (
    <div className="min-h-screen bg-parchment dark:bg-espresso-deep">
      <header className="sticky top-0 z-40 bg-parchment/90 dark:bg-espresso-deep/90 backdrop-blur-md px-4 pt-6 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-clay/10 transition-colors">
            <ChevronLeft size={24} className="text-charcoal dark:text-cream-soft" />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={18} style={{ color: primary }} />
            <h1 className="text-body font-medium text-charcoal dark:text-cream-soft">Privacy Policy</h1>
          </div>
        </div>
      </header>

      <div className="px-5 pb-12 space-y-6 text-body-sm text-charcoal dark:text-cream-soft">
        <p className="text-caption text-clay">Last updated: May 2026</p>

        <section>
          <h2 className="text-body font-medium mb-2">1. Introduction</h2>
          <p className="text-clay leading-relaxed">Aevum ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">2. Information We Collect</h2>
          <p className="text-clay leading-relaxed mb-2">We collect information you provide directly to us:</p>
          <ul className="text-clay space-y-1 ml-4 list-disc">
            <li>Account information (name, email) via our authentication provider</li>
            <li>Mood check-ins and emotional state entries</li>
            <li>Psychological assessment responses</li>
            <li>Partner connection details (when you choose to link)</li>
            <li>AI chat conversations for service improvement</li>
            <li>App settings and preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">3. How We Use Your Information</h2>
          <p className="text-clay leading-relaxed mb-2">We use the information we collect to:</p>
          <ul className="text-clay space-y-1 ml-4 list-disc">
            <li>Provide and maintain our services</li>
            <li>Enable partner connection and shared insights</li>
            <li>Generate personalised AI responses</li>
            <li>Improve our services and user experience</li>
            <li>Send push notifications (with your consent)</li>
            <li>Ensure security and prevent abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">4. Data Storage and Security</h2>
          <p className="text-clay leading-relaxed">Your data is stored on secure cloud servers with encryption at rest and in transit. We use industry-standard security measures to protect your information. API keys for third-party services (such as OpenAI) are encrypted and stored locally on your device when provided by you.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">5. Partner Data Sharing</h2>
          <p className="text-clay leading-relaxed">When you connect with a partner, you choose what information to share. Mood check-ins and certain insights can be shared only when you explicitly enable sharing. You can unlink your partner at any time, which stops all data sharing.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">6. Third-Party Services</h2>
          <p className="text-clay leading-relaxed">We use OpenAI for AI-generated responses and images. Conversations sent to OpenAI are subject to their privacy policy. We do not sell your data to third parties.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">7. Your Rights</h2>
          <p className="text-clay leading-relaxed mb-2">You have the right to:</p>
          <ul className="text-clay space-y-1 ml-4 list-disc">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Withdraw consent for data processing</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">8. Contact Us</h2>
          <p className="text-clay leading-relaxed">If you have questions about this Privacy Policy, please contact us through the app or at our support channel.</p>
        </section>
      </div>
    </div>
  );
}
