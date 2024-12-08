import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
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
              fontSize: "0.75rem",
              padding: "11px 16px",
            },
            className: "w-fit right-0",
          }}
        />
      </body>
    </html>
  );
}
