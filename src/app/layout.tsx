import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSession } from "@/actions/getSession";
import { UserProvider } from "@/store/userStore";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerList Forms",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await getSession();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <UserProvider>{children}</UserProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "white",
              borderRadius: "14px",
              fontSize: "0.8rem",
              padding: "11px 16px",
              right: 0,
              width: "auto",
            },
          }}
        />
      </body>
    </html>
  );
}
