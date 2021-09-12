import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider as AuthProvider } from "next-auth/client";
import SessionGate from "../src/components/SessionGate";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider session={pageProps.session}>
      <SessionGate>
        <Component {...pageProps} />
      </SessionGate>
    </AuthProvider>
  );
}

export default MyApp;
