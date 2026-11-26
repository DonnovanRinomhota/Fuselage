/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Screening PDFs are served through an authenticated route, so they must ship with that function.
  outputFileTracingIncludes: { "/api/portal/files": ["./private-docs/**"] },
};
export default nextConfig;
