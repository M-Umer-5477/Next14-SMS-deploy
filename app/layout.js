import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/components/SessionProvider";
import Navbarr from "@/components/navbar";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Management System",
  description: "A modern platform for managing students, courses, attendance, and timetables efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={`${inter.className} antialiased`}>
      <Provider>
        <Navbarr/>
        {children}
      </Provider>
      </body>
    </html>
  );
}
