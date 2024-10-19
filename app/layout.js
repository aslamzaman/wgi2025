import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WGI App",
  description: "WGI created by Aslam Zaman",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/x-icon" href="/images/logo.jpg" />
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
