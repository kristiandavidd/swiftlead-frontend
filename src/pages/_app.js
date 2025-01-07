import "@/styles/globals.css";
import { UserProvider } from "@/context/userContext";
import { Toast, ToastProvider } from "@/components/ui/toast";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ToastProvider>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ToastProvider>
  );
}
