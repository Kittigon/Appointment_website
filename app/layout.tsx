import Navbar from "@/components/Navbar";
import './globals.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  data-theme="light">
      <body className="bg-[#E8D7F4] overflow-x-hidden min-h-screen">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
