import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext"; // ALTERADO: Importe o AuthProvider

export default function App({ Component, pageProps }: AppProps) {
  return (
    // ALTERADO: Envolva o Component com o AuthProvider
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}