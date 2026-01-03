import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "1159 Realty - CRM & Admin Portal",
  description: "Comprehensive CRM and admin portal for managing properties, leads, clients, agents, partners, and commissions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <AuthenticatedLayout>{children}</AuthenticatedLayout>
        </Providers>
      </body>
    </html>
  );
}
