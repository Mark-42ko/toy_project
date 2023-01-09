import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { createContext, useState } from "react";

interface GlobalContext {
  accessToken?: string;
  setAccessToken?: Function;
  userData?: {
    userId: string;
    username: string;
    userPhoneNumber: string;
  };
  setUserData?: Function;
}

export const GlobalContext = createContext<GlobalContext | null>({});

export default function App({ Component, pageProps }: AppProps) {
  const [accessToken, setAccessToken] = useState();
  const [userData, setUserData] = useState();

  const value = {
    accessToken,
    setAccessToken,
    userData,
    setUserData,
  };

  return (
    <GlobalContext.Provider value={value}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </GlobalContext.Provider>
  );
}
