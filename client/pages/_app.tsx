import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { createContext, useState, useEffect } from "react";
import { createGlobalStyle } from "styled-components";

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

export const GlobalStyles = createGlobalStyle`
  html, body, #__next {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
`;

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
    <>
      <GlobalStyles />
      <GlobalContext.Provider value={value}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </GlobalContext.Provider>
    </>
  );
}
