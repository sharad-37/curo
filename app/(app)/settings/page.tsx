// app/(app)/settings/page.tsx
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl p-8 lg:p-12">
      <h1 className="mb-8 text-3xl font-light">Settings</h1>
      <div className="rounded-2xl border border-curo-border bg-curo-surface p-6">
        <p className="text-sm text-curo-text-muted">Signed in as</p>
        <p className="mt-1 text-lg">{session.user.name}</p>
        <p className="text-sm text-curo-text-secondary">{session.user.email}</p>
        <form
          className="mt-8"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-full bg-curo-text px-5 py-2.5 text-sm text-curo-background"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
