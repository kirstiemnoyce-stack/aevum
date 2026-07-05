import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export default function TermsScreen() {
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
            <FileText size={18} style={{ color: primary }} />
            <h1 className="text-body font-medium text-charcoal dark:text-cream-soft">Terms of Service</h1>
          </div>
        </div>
      </header>

      <div className="px-5 pb-12 space-y-6 text-body-sm text-charcoal dark:text-cream-soft">
        <p className="text-caption text-clay">Last updated: May 2026</p>

        <section>
          <h2 className="text-body font-medium mb-2">1. Acceptance of Terms</h2>
          <p className="text-clay leading-relaxed">By accessing or using Aevum ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">2. Description of Service</h2>
          <p className="text-clay leading-relaxed">Aevum is a relationship wellness and personal growth platform that provides AI-powered coaching, mood tracking, psychological assessments, and partner connection features.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">3. Eligibility</h2>
          <p className="text-clay leading-relaxed">You must be at least 18 years old to use Aevum. By using the App, you represent and warrant that you meet this requirement.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">4. User Accounts</h2>
          <p className="text-clay leading-relaxed">You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">5. Acceptable Use</h2>
          <p className="text-clay leading-relaxed mb-2">You agree not to use Aevum to:</p>
          <ul className="text-clay space-y-1 ml-4 list-disc">
            <li>Harass, abuse, or harm another person</li>
            <li>Generate or share illegal, harmful, or offensive content</li>
            <li>Attempt to gain unauthorised access to the App or its systems</li>
            <li>Use automated systems or bots to access the App</li>
            <li>Interfere with or disrupt the App's functionality</li>
            <li>Reverse engineer or attempt to extract the source code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">6. AI-Generated Content</h2>
          <p className="text-clay leading-relaxed">Aevum uses artificial intelligence to generate responses, suggestions, and insights. AI-generated content is for informational and supportive purposes only and does not constitute professional medical, psychological, or legal advice. Always consult qualified professionals for such advice.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">7. Data and Privacy</h2>
          <p className="text-clay leading-relaxed">Your use of Aevum is also governed by our Privacy Policy. By using the App, you consent to the collection and use of information as described in the Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">8. Subscription and Payments</h2>
          <p className="text-clay leading-relaxed">Certain features may require payment. All purchases are final unless otherwise required by law. We reserve the right to change pricing with notice to users.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">9. Termination</h2>
          <p className="text-clay leading-relaxed">We may terminate or suspend your account at any time for violations of these terms. You may delete your account at any time through the App settings.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">10. Limitation of Liability</h2>
          <p className="text-clay leading-relaxed">Aevum is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the App. This includes but is not limited to emotional distress, relationship outcomes, or decisions made based on AI-generated content.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">11. Governing Law</h2>
          <p className="text-clay leading-relaxed">These Terms are governed by the laws of Australia. Any disputes shall be resolved in the courts of Australia.</p>
        </section>

        <section>
          <h2 className="text-body font-medium mb-2">12. Changes to Terms</h2>
          <p className="text-clay leading-relaxed">We may update these Terms from time to time. We will notify you of significant changes. Continued use of the App after changes constitutes acceptance of the updated Terms.</p>
        </section>
      </div>
    </div>
  );
}
