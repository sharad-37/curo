// app/(app)/transactions/import/page.tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { importParsedCsvAction } from "@/app/actions/transaction-actions";
import { toast } from "sonner";

type Row = Record<string, string>;

export default function ImportPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [dateCol, setDateCol] = useState("");
  const [descCol, setDescCol] = useState("");
  const [amountCol, setAmountCol] = useState("");
  const [typeCol, setTypeCol] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    imported: number;
    failed: number;
  } | null>(null);

  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setResult(null);
    setFileName(file.name);

    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const fields = res.meta.fields || [];
        setHeaders(fields);
        setRows(res.data);
        setDateCol(
          fields.find((f) => /date|txn.*date|value.*date/i.test(f)) ||
            fields[0] ||
            "",
        );
        setDescCol(
          fields.find((f) =>
            /desc|narration|particular|remarks|merchant|details/i.test(f),
          ) ||
            fields[1] ||
            "",
        );
        setAmountCol(
          fields.find((f) =>
            /amount|inr|withdrawal|deposit|debit|credit|value/i.test(f),
          ) ||
            fields[2] ||
            "",
        );
        setTypeCol(
          fields.find((f) => /type|dr\/cr|cr\/dr|txn type/i.test(f)) || "",
        );
      },
      error: () =>
        setError("Could not parse this CSV. Export again as UTF-8 CSV."),
    });
  }

  function confirmImport() {
    startTransition(async () => {
      try {
        const res = await importParsedCsvAction(
          formatted,
          fileName || "statement.csv",
        );
        toast.success(`Successfully imported ${res.imported} transactions`); // Added Toast
        setTimeout(() => router.push("/transactions"), 800);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Import failed"); // Added Toast
      }
    });

    const formatted = rows
      .map((row) => {
        const raw = (row[amountCol] || "0")
          .toString()
          .replace(/[,₹]/g, "")
          .trim();
        const amountNum = Number(raw);
        if (!Number.isFinite(amountNum) || amountNum === 0) return null;

        let type: "DEBIT" | "CREDIT" = amountNum < 0 ? "DEBIT" : "CREDIT";
        if (typeCol && row[typeCol]) {
          const t = row[typeCol].toString().toUpperCase();
          if (/(^DR|DEBIT|WD|WITHDRAW)/.test(t)) type = "DEBIT";
          if (/(^CR|CREDIT|DEPOSIT)/.test(t)) type = "CREDIT";
        } else {
          // Many Indian CSVs use separate debit/credit columns — amount alone often means expense
          type = "DEBIT";
          if (/credit|salary|interest/i.test(row[descCol] || ""))
            type = "CREDIT";
        }

        const d = new Date(row[dateCol] || "");
        if (Number.isNaN(d.getTime())) return null;

        return {
          date: d.toISOString().slice(0, 10),
          description: (row[descCol] || "Transaction").toString().trim(),
          amount: Math.abs(amountNum),
          type,
        };
      })
      .filter(Boolean) as Array<{
      date: string;
      description: string;
      amount: number;
      type: "DEBIT" | "CREDIT";
    }>;

    if (!formatted.length) {
      setError("No valid rows found after mapping. Check date/amount formats.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await importParsedCsvAction(
          formatted,
          fileName || "statement.csv",
        );
        setResult({ imported: res.imported, failed: res.failed });
        setTimeout(() => router.push("/transactions"), 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Import failed");
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-8 lg:p-12">
      <header className="mb-10">
        <h1 className="text-3xl font-light text-curo-text">Import statement</h1>
        <p className="mt-2 text-curo-text-secondary">
          Upload a CSV from your bank or UPI app. We never ask for bank
          passwords.
        </p>
      </header>

      {error && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-curo-negative/30 bg-curo-negative-light px-4 py-3 text-sm text-curo-negative">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-curo-primary/30 bg-curo-primary-light px-4 py-3 text-sm text-curo-primary">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          Imported {result.imported} transactions
          {result.failed ? ` · ${result.failed} skipped` : ""}. Redirecting…
        </div>
      )}

      {!rows.length ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-curo-border bg-curo-surface px-8 py-16 text-center transition-colors hover:border-curo-primary">
          <Upload className="mb-4 text-curo-text-secondary" size={28} />
          <p className="font-medium text-curo-text">
            Drop CSV here or click to browse
          </p>
          <p className="mt-1 text-xs text-curo-text-muted">
            HDFC · ICICI · SBI · Axis · Kotak · custom exports
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={onFile}
          />
        </label>
      ) : (
        <div className="rounded-2xl border border-curo-border bg-curo-surface p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between border-b border-curo-border/60 pb-5">
            <div className="flex items-center gap-3">
              <FileText className="text-curo-primary" size={18} />
              <div>
                <p className="text-sm font-medium text-curo-text">{fileName}</p>
                <p className="text-xs text-curo-text-muted">
                  {rows.length} rows
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs text-curo-text-muted hover:text-curo-text"
              onClick={() => {
                setRows([]);
                setHeaders([]);
                setFileName(null);
                setResult(null);
              }}
            >
              Change file
            </button>
          </div>

          <p className="mb-4 text-label text-curo-text-muted">Map columns</p>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["Date *", dateCol, setDateCol],
              ["Description *", descCol, setDescCol],
              ["Amount *", amountCol, setAmountCol],
              ["Type (optional)", typeCol, setTypeCol],
            ].map(([label, value, setter]) => (
              <label key={label as string} className="block">
                <span className="mb-1.5 block text-xs font-medium text-curo-text-secondary">
                  {label as string}
                </span>
                <select
                  value={value as string}
                  onChange={(e) =>
                    (setter as (v: string) => void)(e.target.value)
                  }
                  className="w-full rounded-lg border border-curo-border bg-curo-background px-3 py-2.5 text-sm"
                >
                  <option value="">—</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          <p className="mb-3 text-label text-curo-text-muted">Preview</p>
          <div className="mb-8 overflow-x-auto rounded-xl border border-curo-border/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-curo-muted-surface/50 text-curo-text-muted">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Description</th>
                  <th className="px-3 py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t border-curo-border/40">
                    <td className="px-3 py-2 font-mono">{r[dateCol]}</td>
                    <td className="max-w-[240px] truncate px-3 py-2">
                      {r[descCol]}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      {r[amountCol]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={confirmImport}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3C3C3C] py-3.5 text-sm font-medium text-[#F1EEE9] transition-all disabled:cursor-not-allowed disabled:bg-[#9B9590] disabled:opacity-80"
          >
            {isPending ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing securely...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Import {rows.length} rows
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
