import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import NavbarWrapper from "@/components/NavbarWrapper";
import { AuthProvider } from "@/context/authContext/context";

export const metadata: Metadata = {
  title: "Treasures Hunters",
  description: "Your trusted partner in financial solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
        <NavbarWrapper /> 
        {children}
        <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
