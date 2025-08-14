// PrivacyPolicyPage.jsx
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">
        Match Trackers ("we", "our", or "us") operates a sports media platform
        that delivers live scores, news, highlights, and updates across Cricket,
        Football, Tennis, F1, and more. We are committed to protecting your
        privacy.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        1. Information We Collect
      </h2>
      <p className="mb-4">We collect the following types of information:</p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Personal data like name, email, and location (if voluntarily
          provided).
        </li>
        <li>
          Device and browser information for analytics and user experience.
        </li>
        <li>
          Usage data such as pages visited, time spent, and interaction
          behavior.
        </li>
        <li>Cookies and similar tracking technologies.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">We use your data to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide and improve our services.</li>
        <li>Personalize content and recommendations.</li>
        <li>Analyze user behavior and optimize our platform.</li>
        <li>Communicate with users for service updates or promotions.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        3. Data Sharing & Disclosure
      </h2>
      <p className="mb-4">We do not sell your data. We may share data with:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Trusted partners who help us operate and improve the service.</li>
        <li>Legal authorities when required to comply with laws.</li>
        <li>
          Third-party tools (analytics, email services) with appropriate
          safeguards.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        4. Cookies & Tracking
      </h2>
      <p className="mb-4">
        We use cookies to enhance your experience, understand usage patterns,
        and serve relevant content and ads.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal data.
        Contact us at <span className="text-blue-600 dark:text-blue-400">privacy@matchtrackers.com</span>.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">
        6. Children's Privacy
      </h2>
      <p className="mb-4">
        Our services are not directed to individuals under 13. We do not
        knowingly collect data from children.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Updates to Policy</h2>
      <p className="mb-4">
        We may update this policy periodically. Continued use of our service
        means you accept the revised policy.
      </p>

      <p className="mt-8">Last updated: April 16, 2025</p>
    </div>
  );
}
