import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: { default: "Fuselage Resources | Borehole drilling, construction materials & supply, Norton", template: "%s | Fuselage Resources" },
  description:
    "Multi-sector supplier in Norton, Zimbabwe: borehole drilling, construction materials, butchery and meat, fresh produce, groceries and provisions for government, institutions, contractors, farmers and households.",
  icons: { icon: "/img/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
