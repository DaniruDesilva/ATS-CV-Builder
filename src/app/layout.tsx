import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "ResumAI | AI Resume Builder & Job-Winning ATS CV Maker",
  description: "Build job-winning, recruiter-approved resumes in minutes and score your CV against any job description with intelligent AI suggestions.",
  keywords: ["AI Resume Builder", "ATS Resume Checker", "Professional CV Maker", "Free Resume Builder", "Job Winning Resume"],
  openGraph: {
    title: "ResumAI | AI Resume Builder & Job-Winning ATS CV Maker",
    description: "Create professional, recruiter-approved resumes and check your ATS compatibility score instantly.",
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
      <body className="font-sans bg-white text-slate-900 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
