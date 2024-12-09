import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { UserProvider } from "@/store/userStore";
import { getSession } from "@/actions/getSession";
import SetSession from "@/components/SetSession";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PeerList Forms",
  description: "",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getSession();
  return (
    <html lang="en" className=" overflow-hidden">
      <body className={`${inter.className} antialiased`}>
        <UserProvider>
          <SetSession user={user} />
          {children}
        </UserProvider>
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
