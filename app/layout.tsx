'use client';
import "./globals.css";
import { Poppins } from "next/font/google";
import { Josefin_Sans } from "next/font/google";
import { ThemeProvider } from "./utils/theme-provider";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Provider";
import {SessionProvider} from "next-auth/react";
import { useLoadUserQuery, useRefreshTokenQuery } from "../redux/features/api/apiSlice";
import Loader from "./components/Loader/Loader";
import { useEffect, useRef, useState } from "react";

import socketIO, { type Socket } from "socket.io-client";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300 bg-no-repeat`}
      >
        <Providers>
          <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
          >
            <Custom>
              {children}
            </Custom>
            <Toaster position="top-center" reverseOrder={false} />
          </ThemeProvider>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}



const Custom = ({children}: {children: React.ReactNode}) => {
  const [mounted, setMounted] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Avoid calling backend APIs during SSR/static generation (Vercel build),
  // only run these queries after the app mounts in the browser.
  const { isLoading: isRefreshing } = useRefreshTokenQuery(undefined, { skip: !mounted });
  const { isLoading: isLoadingUser } = useLoadUserQuery(undefined, { skip: !mounted });

  useEffect(() => {
    if (!mounted) return;

    const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "/";
    const socket = socketIO(ENDPOINT, { transports: ["websocket"] });
    socketRef.current = socket;

    const onConnect = () => {
      console.log("Connected to socket", socket.id);
    };

    const onDisconnect = (reason: unknown) => {
      console.log("Socket disconnected:", reason);
    };
    const onConnectError = (err: unknown) => {
      const msg =
        typeof err === "object" && err && "message" in err
          ? (err as { message?: unknown }).message
          : err;
      console.log("Socket connect_error:", msg);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // If the socket connected before this effect ran, "connect" won't fire again.
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Ensure SSR and first client render match to prevent hydration mismatch
  if (!mounted) {
    return null;
  }
  return (
    <>
      {isRefreshing || isLoadingUser ? (
        <>
          <Loader />
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
