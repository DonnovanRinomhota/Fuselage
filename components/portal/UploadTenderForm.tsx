"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

type Kind = "tender" | "screening";
type Picked = { file: File; kind: Kind };
type Errors = Partial<Record<"reference" | "title" | "entity" | "closesDate" | "closesTime" | "files" | "form", string>>;

const CATEGORIES = ["Construction materials", "Borehole drilling", "Butchery & meat", "Fruit & vegetables", "Groceries & provisions", "Other"];
const SOURCES = ["PRAZ e-GP", "Government Gazette", "Newspaper", "Sent by buyer", "Other"];
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.zip,.jpg,.jpeg,.png";
const MAX = 25 * 1024 * 1024;

export default function UploadTenderForm({ mode, inbox }: { mode: "blob" | "local"; inbox: string }) {
  const router = useRouter();
  const [picked, setPicked] = useState<Picked[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const tenderInput = useRef<HTMLInputElement>(null);
  const screeningInput = useRef<HTMLInputElement>(null);

  function add(kind: Kind, list: FileList | null) {
    if (!list) return;
    const next = [...picked];
    const errs: string[] = [];
    for (const f of Array.from(list)) {
      if (f.size > MAX) errs.push(`${f.name} is over 25 MB`);
      else next.push({ file: f, kind });
    }
    setPicked(next.slice(0, 10));
    setErrors((e) => ({ ...e, files: errs.length ? `${errs.join("; ")}. Split or compress it, then add it again.` : undefined }));
  }

  async function uploadOne(f: File) {
    const safe = f.name.replace(/[^\w.\- ]+/g, "_").replace(/\s+/g, "_");
    const day = new Date().toISOString().slice(0, 10);
    if (mode === "blob") {
      const r = await upload(`files/${day}/${safe}`, f, { access: "private", handleUploadUrl: "/api/portal/upload", multipart: f.size > 5 * 1024 * 1024 });
      return { pathname: r.pathname, size: f.size };
    }
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("/api/portal/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `${f.name} didn't upload`);
    return { pathname: json.pathname as string, size: f.size };
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const errs: Errors = {};
    if (!data.reference?.trim()) errs.reference = "Enter the tender reference number.";
    if (!data.title?.trim()) errs.title = "Enter the tender title.";
    if (!data.entity?.trim()) errs.entity = "Enter the procuring entity.";
    if (!data.closesDate) errs.closesDate = "Enter the closing date.";
    if (!picked.length) errs.files = "Attach the tender document, a screening document, or both.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      const first = (["reference", "title", "entity", "closesDate"] as const).find((k) => errs[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }

    setBusy(true);
    setErrors({});
    try {
      const files = [];
      for (let i = 0; i < picked.length; i++) {
        setStatus(`Uploading ${i + 1} of ${picked.length}: ${picked[i].file.name}`);
        const r = await uploadOne(picked[i].file);
        files.push({ ...r, name: picked[i].file.name, kind: picked[i].kind });
      }
      setStatus("Saving tender and emailing the tenders inbox…");
      const res = await fetch("/api/portal/tenders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, files }) });
      const json = await res.json();
      if (!res.ok) {
        setErrors(json.errors || { form: json.error || "The tender wasn't saved. Try again." });
        setStatus("");
        setBusy(false);
        return;
      }
      const q = new URLSearchParams({ uploaded: "1", ...(json.emailError ? { emailfail: "1" } : {}) });
      router.push(`/portal/tenders/${json.id}?${q}`);
      router.refresh();
    } catch (err) {
      setErrors({ form: `${err instanceof Error ? err.message : "Upload failed"}. Nothing was saved. Check your connection and try again.` });
      setStatus("");
      setBusy(false);
    }
  }

  const fileRow = (p: Picked, i: number) => (
    <li key={i}>
      <span>{p.file.name} <span className="muted small">({fmtSize(p.file.size)}, {p.kind === "tender" ? "tender document" : "screening"})</span></span>
      <button type="button" className="linkish" onClick={() => setPicked(picked.filter((_, j) => j !== i))} aria-label={`Remove ${p.file.name}`}>Remove</button>
    </li>
  );

  return (
    <form className="form" onSubmit={onSubmit} noValidate style={{ maxWidth: 820 }} onInput={(e) => { const id = (e.target as HTMLElement).id; if (id && errors[id as keyof Errors]) setErrors({ ...errors, [id]: undefined }); }}>
      {errors.form && <div className="notice notice-err" role="alert">{errors.form}</div>}
      <section className="panel stack">
        <h2>Tender details</h2>
        <div className="form-row">
          <F id="reference" label="Tender reference" hint="as on e-GP, e.g. COH/S.17/2026" err={errors.reference} />
          <div className="field">
            <label htmlFor="source">Where you found it</label>
            <select id="source" name="source" defaultValue="PRAZ e-GP">{SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
        </div>
        <F id="title" label="Tender title" err={errors.title} />
        <div className="form-row">
          <F id="entity" label="Procuring entity" hint="e.g. City of Harare" err={errors.entity} />
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue="Construction materials">{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        </div>
        <div className="form-row">
          <F id="closesDate" label="Closing date" type="date" err={errors.closesDate} />
          <F id="closesTime" label="Closing time" hint="(optional, Harare time)" type="time" err={errors.closesTime} />
        </div>
        <div className="field">
          <label htmlFor="notes">Notes <span className="hint">(optional: anything the team should know)</span></label>
          <textarea id="notes" name="notes" style={{ minHeight: 90 }} />
        </div>
      </section>

      <section className="panel stack" aria-describedby="files-help">
        <h2>Documents</h2>
        <p id="files-help" className="small muted" style={{ margin: 0 }}>PDF, Word, Excel, ZIP, JPG or PNG. Up to 25 MB each, 10 files in total.</p>
        <div style={{ display: "flex", gap: ".6rem", flexWrap: "wrap" }}>
          <input ref={tenderInput} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { add("tender", e.target.files); e.target.value = ""; }} />
          <input ref={screeningInput} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { add("screening", e.target.files); e.target.value = ""; }} />
          <button type="button" className="btn btn-ghost" onClick={() => tenderInput.current?.click()}>Add tender document</button>
          <button type="button" className="btn btn-ghost" onClick={() => screeningInput.current?.click()}>Add screening document</button>
        </div>
        {picked.length > 0 && <ul className="check" style={{ marginTop: ".4rem" }}>{picked.map(fileRow)}</ul>}
        {errors.files && <p className="err" role="alert" style={{ color: "var(--red)", margin: 0 }}>{errors.files}</p>}
      </section>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload tender"}</button>
        <span className="small muted" aria-live="polite">{status || `Documents are emailed to ${inbox}.`}</span>
      </div>
    </form>
  );
}

function F({ id, label, hint, type = "text", err }: { id: string; label: string; hint?: string; type?: string; err?: string }) {
  return (
    <div className="field" data-invalid={!!err}>
      <label htmlFor={id}>{label} {hint && <span className="hint">{hint}</span>}</label>
      <input id={id} name={id} type={type} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} />
      {err && <p className="err" id={`${id}-err`}>{err}</p>}
    </div>
  );
}

export function fmtSize(b: number) {
  return b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;
}
