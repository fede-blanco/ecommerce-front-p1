import { CartContextProvider } from "@/components/CartContext.js"
import { createGlobalStyle } from "styled-components"
import { SessionProvider } from "next-auth/react"

const GlobalStyles = createGlobalStyle`

*{
  box-sizing: border-box;
}

html {
  box-sizing: inherit;
}

body{
  padding: 0;
  margin: 0 ;
  padding-bottom: 1rem;
  background-color: #f0f0f0;
  font-family: 'Poppins', sans-serif;
  }
  hr {
    display: block;
    border: 0;
    border-top: 1px solid #ccc;
  }
`

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <GlobalStyles />
      <SessionProvider session={session}>
        <CartContextProvider>
          <Component {...pageProps} />
        </CartContextProvider>
      </SessionProvider>
    </>
  )
}
