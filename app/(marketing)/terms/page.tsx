// app/(marketing)/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-32 lg:px-10">
      <h1 className="text-display-sm mb-6 text-curo-text">Terms of Service</h1>
      <p className="text-body-md mb-8 text-curo-text-secondary">
        Last updated: January 2025
      </p>
      <div className="space-y-6 text-curo-text-secondary">
        <p>
          Welcome to Curo. By accessing or using our platform, you agree to
          these Terms of Service.
        </p>
        <h2 className="text-xl font-medium text-curo-text pt-4">
          1. Financial Intelligence Tool
        </h2>
        <p>
          Curo is an informational personal finance management and intelligence
          platform. Curo does not execute financial transactions, hold deposit
          balances, or provide certified tax or legal advisory services.
        </p>
        <h2 className="text-xl font-medium text-curo-text pt-4">
          2. Account Responsibility
        </h2>
        <p>
          You are responsible for maintaining the security of your
          authentication tokens and imported financial records.
        </p>
      </div>
    </div>
  );
}
