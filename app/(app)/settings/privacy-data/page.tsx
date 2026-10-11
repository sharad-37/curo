// app/(app)/settings/privacy-data/page.tsx
"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { Download, Trash2, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  exportUserDataAction,
  deleteUserDataAndAccountAction,
} from "@/app/actions/privacy-actions";

export default function PrivacyDataPage() {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExportData = () => {
    startTransition(async () => {
      const data = await exportUserDataAction();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `curo_data_backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    });
  };

  const handleDeleteAccount = () => {
    startTransition(async () => {
      await deleteUserDataAndAccountAction();
      signOut({ callbackUrl: "/" });
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-light text-curo-text">
          Privacy & Data Control
        </h1>
        <p className="mt-1 text-curo-text-secondary">
          You own your financial records. Export or permanently delete your data
          at any time.
        </p>
      </header>

      {/* Export Card */}
      <div className="mb-8 rounded-2xl border border-curo-border bg-curo-surface p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-medium text-curo-text">
              <Download size={18} className="text-curo-primary" />
              <span>Export Complete Data Backup</span>
            </div>
            <p className="mt-2 text-xs text-curo-text-secondary max-w-xl leading-relaxed">
              Download an encrypted JSON file containing all your processed
              statement records, category edits, and budget thresholds.
            </p>
          </div>
          <button
            onClick={handleExportData}
            disabled={isPending}
            className="rounded-full bg-curo-text px-6 py-2.5 text-xs font-medium text-curo-background hover:bg-curo-primary transition-colors disabled:opacity-50"
          >
            {isPending ? "Exporting..." : "Download Backup (.json)"}
          </button>
        </div>
      </div>

      {/* Delete / Nuke Card */}
      <div className="rounded-2xl border border-curo-negative/30 bg-curo-negative-light/30 p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 font-medium text-curo-negative">
              <Trash2 size={18} />
              <span>Irreversible Account & Data Deletion</span>
            </div>
            <p className="mt-2 text-xs text-curo-text-secondary max-w-xl leading-relaxed">
              Permanently delete your account profile, transaction records, and
              classification history from Neon PostgreSQL. This action cannot be
              undone.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-full bg-curo-negative px-6 py-2.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-curo-border bg-curo-surface p-6 shadow-lg">
            <div className="flex items-center gap-2 text-curo-negative font-medium mb-2">
              <AlertTriangle size={20} />
              <span>Confirm Account Wipe</span>
            </div>
            <p className="text-xs text-curo-text-secondary mb-6 leading-relaxed">
              Are you completely sure? All your imported financial records will
              be purged immediately from the database.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-full px-4 py-2 text-xs font-medium text-curo-text-secondary hover:text-curo-text"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isPending}
                className="rounded-full bg-curo-negative px-5 py-2 text-xs font-medium text-white hover:bg-red-700"
              >
                {isPending ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
