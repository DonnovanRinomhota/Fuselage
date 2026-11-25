"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { divisions, enquiryTypes, team, type EnquiryType } from "@/lib/site";

export default function RequestTicket() {
  const router = useRouter();
  const [service, setService] = useState(divisions[1].slug);
  const [type, setType] = useState<EnquiryType>("quote");
  const owner = team[enquiryTypes.find((t) => t.value === type)!.owner];

  return (
    <form
      className="ticket"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/contact?type=${type}&service=${service}#enquiry`);
      }}
    >
      <div className="ticket-head">
        <h2>Start a request</h2>
        <p>One supplier for all five. Tell us what you need and it goes straight to the right person.</p>
      </div>
      <div className="ticket-body">
        <fieldset>
          <legend>What do you need?</legend>
          <div className="choice-grid">
            {divisions.map((d) => (
              <label className="choice" key={d.slug}>
                <input type="radio" name="service" value={d.slug} checked={service === d.slug} onChange={() => setService(d.slug)} />
                <span>{d.short}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset style={{ marginTop: "1.1rem" }}>
          <legend>It&apos;s about</legend>
          <div className="choice-grid">
            {enquiryTypes.map((t) => (
              <label className="choice" key={t.value}>
                <input type="radio" name="type" value={t.value} checked={type === t.value} onChange={() => setType(t.value)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="route" aria-live="polite">
          <img src={owner.photo} alt="" width={52} height={52} />
          <p><b>{owner.first}</b> handles this.<br /><span className="muted">{owner.role}</span></p>
        </div>
        <button className="btn btn-primary" type="submit">Continue to your request</button>
      </div>
    </form>
  );
}
