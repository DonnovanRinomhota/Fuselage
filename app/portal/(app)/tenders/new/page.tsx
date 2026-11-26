import Link from "next/link";
import UploadTenderForm from "@/components/portal/UploadTenderForm";
import { usingBlob } from "@/lib/store";

export const metadata = { title: "Upload a tender" };

export default function NewTender() {
  const inbox = process.env.TENDERS_INBOX_EMAIL || process.env.ROUTE_TENDERS_EMAIL || "fuselageresources@outlook.com";
  return (
    <>
      <p className="small"><Link href="/portal/tenders">Tenders</Link></p>
      <h1>Upload a tender</h1>
      <p className="muted" style={{ marginTop: ".4rem", maxWidth: "60ch" }}>
        Add a tender you found, with its bid document and any screening notes. It appears in the tender list, and the
        documents go to the company tenders inbox ({inbox}).
      </p>
      <div style={{ marginTop: "1.4rem" }}>
        <UploadTenderForm mode={usingBlob() ? "blob" : "local"} inbox={inbox} />
      </div>
    </>
  );
}
