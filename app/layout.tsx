import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"Avilo Fit",description:"A calmer way to plan your next meal."};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
