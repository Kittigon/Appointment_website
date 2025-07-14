import Navbar from "@/component/Navbar";
import './globals.css';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#E8D7F4] overflow-x-hidden">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
