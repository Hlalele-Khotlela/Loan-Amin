import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'Treasures Hunters',
  description: 'Your trusted partner in financial solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <header className="flex items-center justify-between bg-gray-700 text-white px-6 py-3 shadow-md mt-3">
                 {/* Organisation Name */}
                  <h1 className="text-xl font-bold tracking-wide">TREASURES HUNTUERS</h1> 
                  <div className='float-left'>
                    <h2>welcome Admin</h2>
                  </div>
                  {/* Login / Logout Link */} 
                  <nav> 
                    <Link href="/login" className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold shadow hover:bg-gray-100 transition" > Login </Link> 
                    </nav>
                     </header>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
