import "@/styles/globals.css";
import { UserProvider } from "@/context/userContext";
import { Toast, ToastProvider } from "@/components/ui/toast";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ToastProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ToastProvider>
  );
}
