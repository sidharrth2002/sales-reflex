import "@/styles/globals.css";
// import "@fontsource/inter"
// import "@fontsource/inter/100.css"
// import "@fontsource/inter/200.css"
// import "@fontsource/inter/300.css"
// import "@fontsource/inter/400.css"
// import "@fontsource/inter/500.css"
// import "@fontsource/inter/600.css"
// import "@fontsource/inter/700.css"
// import "@fontsource/inter/800.css"
import "@fontsource/dm-sans"
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/700.css"

import { Session, SessionContextProvider } from "@supabase/auth-helpers-react";

import { CartProvider } from "@/context/cart";
import { ChakraProvider } from "@chakra-ui/react";
import TimeAgo from "javascript-time-ago";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import en from "javascript-time-ago/locale/en.json";
import theme from "../lib/theme";
import { useState } from "react";

TimeAgo.addDefaultLocale(en);

export default function App({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <ChakraProvider theme={theme}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </SessionContextProvider>
    </ChakraProvider>
  );
}
