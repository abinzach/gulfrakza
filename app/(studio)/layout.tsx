import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GulfRakza Content Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
