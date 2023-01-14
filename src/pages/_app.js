import "@/styles/globals.css";

import {ChakraProvider} from "@chakra-ui/react";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {Session, SessionContextProvider} from "@supabase/auth-helpers-react";
import {useState} from "react";

export default function App({Component, pageProps}) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <ChakraProvider>
      <SessionContextProvider
  supabaseClient = {supabaseClient} initialSession =
      {pageProps.initialSession} >

      <Component { ...pageProps } />
      </SessionContextProvider><
      /ChakraProvider>
  );
}
