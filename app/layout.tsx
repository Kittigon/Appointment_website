import Navbar from "@/components/Navbar";
import './globals.css';
import { Toaster } from 'react-hot-toast'


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className="bg-[#E8D7F4] overflow-x-hidden min-h-screen">
        <header>
          <title>Appointment Website</title>
        </header>
        <Navbar />
        {children}
        <Toaster position="bottom-right"/>
      </body>
    </html>
  );
}
