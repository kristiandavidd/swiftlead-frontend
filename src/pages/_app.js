import "@/styles/globals.css";
import { UserProvider } from "@/context/userContext";

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}
