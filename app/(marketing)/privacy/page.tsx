// app/(marketing)/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32 lg:px-10">
      <h1 className="text-display-sm mb-6 text-curo-text">Privacy Policy</h1>
      <p className="text-body-md mb-8 text-curo-text-secondary">
        Last updated: January 2025
      </p>
      <div className="space-y-6 text-curo-text-secondary">
        <p>
          At Curo, privacy is not an afterthought — it is our primary
          architectural constraint. We never store bank login credentials, never
          read your SMS messages, and never sell your financial data to third
          parties.
        </p>
        <h2 className="text-xl font-medium text-curo-text pt-4">
          1. Data Ingestion
        </h2>
        <p>
          You remain in full control of the financial records you import into
          Curo. Transactions uploaded via CSV are encrypted in transit (TLS 1.3)
          and at rest using AES-256 in isolated database partitions.
        </p>
        <h2 className="text-xl font-medium text-curo-text pt-4">
          2. AI & Machine Learning
        </h2>
        <p>
          Transaction categorization models process normalized merchant
          descriptions locally or via secure Python microservices. Your raw
          personal identifiers are never passed to external public LLM training
          sets.
        </p>
        <h2 className="text-xl font-medium text-curo-text pt-4">
          3. Data Deletion
        </h2>
        <p>
          You may export or permanently delete your account and all associated
          transaction records at any time directly from the settings panel.
        </p>
      </div>
    </div>
  );
}
