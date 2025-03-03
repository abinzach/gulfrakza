import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-7xl font-inter pt-20 mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm">Last updated: 26-02-2025</p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Introduction</h2>
        <p className="mb-4 text-sm">
          At Gulf Rakza, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Information We Collect</h2>
        <p className="mb-2 text-sm">
          <strong>Personal Data:</strong> We may collect personal information such as your name, email address, phone number, and other contact details when you voluntarily provide them to us.
        </p>
        <p className="mb-2 text-sm">
          <strong>Usage Data:</strong> We automatically collect information on how you access and use our website, including your IP address, browser type, pages visited, and time spent on our site.
        </p>
        <p className="mb-2 text-sm">
          <strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How We Use Your Information</h2>
        <p className="mb-2 text-sm">We may use the information we collect to:</p>
        <ul className="list-disc list-inside mb-2 text-sm">
          <li>Provide, operate, and maintain our website.</li>
          <li>Improve, personalize, and expand our website.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you regarding updates, offers, or other relevant information.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Disclosure of Your Information</h2>
        <p className="mb-2 text-sm">
          We may share your information in the following circumstances:
        </p>
        <ul className="list-disc list-inside mb-2 text-sm">
          <li>With service providers who perform services on our behalf.</li>
          <li>In response to legal requests or to comply with legal obligations.</li>
          <li>In connection with a merger, acquisition, or sale of all or part of our assets.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Rights and Choices</h2>
        <p className="mb-2 text-sm">
          You have the right to access, correct, or delete your personal information. You may also opt out of receiving marketing communications from us. To exercise these rights, please contact us at{' '}
          <a href="mailto:privacy@gulfrakza.com" className="text-blue-600 underline">
            privacy@gulfrakza.com
          </a>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Security</h2>
        <p className="mb-2 text-sm">
          We take reasonable steps to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is completely secure.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Changes to This Privacy Policy</h2>
        <p className="mb-2 text-sm">
          We may update our Privacy Policy from time to time. When we make changes, we will update the "Last updated" date at the top of this page. Your continued use of the website after any changes signifies your acceptance of the updated policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
        <p className="mb-2 text-sm">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@gulfrakza.com" className="text-blue-600 underline">
            privacy@gulfrakza.com
          </a>.
        </p>
      </section>
    </main>
  );
}
