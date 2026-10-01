import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chrono — Real-Time AI Intelligence",
  description: "17 AI sources. Updated hourly. Zero noise.",
  icons: {
    icon: "/robot_icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className={`${geist.className} h-full bg-slate-50 text-slate-900 antialiased`}>
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
          <Sidebar />
          <main className="flex-1 h-screen overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
