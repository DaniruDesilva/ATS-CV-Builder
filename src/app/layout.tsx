import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ATS Resume Builder & AI CV Checker | Professional ATS Resumes",
  description: "Build ATS-compliant resumes with native vector PDF exports and check your resume against target job descriptions using Google Gemini AI.",
  keywords: ["ATS Resume Builder", "ATS CV Checker", "Resume AI Optimizer", "Free ATS Resume", "Vector PDF Resume"],
  openGraph: {
    title: "ATS Resume Builder & AI CV Checker",
    description: "Create vector ATS-safe resumes and score your CV instantly against enterprise ATS rules.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-white text-slate-900 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
