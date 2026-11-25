"use client";
import { useState } from "react";
import { divisions, enquiryTypes, team, type EnquiryType } from "@/lib/site";

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "form", string>>;

export default function EnquiryForm({ defaultType, defaultService }: { defaultType: EnquiryType; defaultService: string }) {
  const [type, setType] = useState<EnquiryType>(defaultType);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [ref, setRef] = useState("");
  const owner = team[enquiryTypes.find((t) => t.value === type)!.owner];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) {
        const errs: Errors = json.errors || { form: "Your request wasn't sent. Check the fields below and try again." };
        setErrors(errs);
        setStatus("idle");
        const first = (["name", "email", "phone", "message"] as const).find((k) => errs[k]);
        if (first) requestAnimationFrame(() => document.getElementById(first)?.focus());
        return;
      }
      setRef(json.reference);
      setStatus("sent");
    } catch {
      setErrors({ form: "Your request wasn't sent because the connection dropped. Try again, or call us." });
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <div className="notice notice-ok" role="status">
        <h3 style={{ color: "inherit" }}>Request sent</h3>
        <p style={{ margin: ".5rem 0 0" }}>
          Your reference is <b>{ref}</b>. {owner.first} will reply, and a copy of your request is on its way to your
          inbox.
        </p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      {errors.form && <div className="notice notice-err" role="alert">{errors.form}</div>}
      <div className="form-row">
        <div className="field">
          <label htmlFor="type">Your request is about</label>
          <select id="type" name="type" value={type} onChange={(e) => setType(e.target.value as EnquiryType)}>
            {enquiryTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="service">Service</label>
          <select id="service" name="service" defaultValue={defaultService}>
            {divisions.map((d) => <option key={d.slug} value={d.slug}>{d.short}</option>)}
            <option value="other">Something else</option>
          </select>
        </div>
      </div>
      <p className="small muted" style={{ margin: "-.3rem 0 0" }} aria-live="polite">
        Goes to {owner.first}, {owner.role}.
      </p>
      <div className="form-row">
        <Field id="name" label="Your name" error={errors.name} autoComplete="name" required />
        <Field id="organisation" label="Organisation" hint="(optional)" autoComplete="organization" />
      </div>
      <div className="form-row">
        <Field id="email" label="Email" type="email" error={errors.email} autoComplete="email" required />
        <Field id="phone" label="Phone or WhatsApp" type="tel" error={errors.phone} autoComplete="tel" required />
      </div>
      <div className="form-row">
        <Field id="location" label="Delivery location or site" hint="(town or address)" />
        <Field id="needed_by" label="Needed by" type="date" />
      </div>
      <div className={"field"} data-invalid={!!errors.message}>
        <label htmlFor="message">What do you need? <span className="hint">Items, quantities, grades or brands, or the tender number</span></label>
        <textarea id="message" name="message" required aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        {errors.message && <p className="err" id="message-err">{errors.message}</p>}
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button className="btn btn-primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending request…" : "Send request"}
        </button>
      </div>
      <p className="small muted">Attachments such as a bill of quantities or tender document can be emailed after you receive your reference.</p>
    </form>
  );
}

function Field(props: { id: string; label: string; hint?: string; type?: string; error?: string; required?: boolean; autoComplete?: string }) {
  const { id, label, hint, type = "text", error, required, autoComplete } = props;
  return (
    <div className="field" data-invalid={!!error}>
      <label htmlFor={id}>{label} {hint && <span className="hint">{hint}</span>}</label>
      <input id={id} name={id} type={type} required={required} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      {error && <p className="err" id={`${id}-err`}>{error}</p>}
    </div>
  );
}
