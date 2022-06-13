import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Banner from "components/Banner";
import Footer from "components/Footer";
import Header from "components/Header";
import AccountContext from "context/account";
import React, { useEffect, useState } from "react";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

function App() {
  const [account, setaccount] = useState(null);

  useEffect(() => {
    async function getAccount() {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setaccount(accounts[0]);
    }

    getAccount();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <AccountContext.Provider value={{ account, setaccount }}>
        <div className="App w-full min-h-screen flex flex-col justify-between">
          <div>
            <Header />
            <Banner />
          </div>
          <Footer />
        </div>
      </AccountContext.Provider>
    </ChakraProvider>
  );
}

export default App;
