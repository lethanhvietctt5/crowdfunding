import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import MainRouter from "components/MainRouter";
import AccountContext from "context/account";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

function App() {
  const [account, setaccount] = useState(null);

  window.ethereum.on("accountsChanged", function (accs) {
    // Time to reload your interface with accs[0]!
    setaccount(accs[0]);
  });

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
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AccountContext.Provider value={{ account, setaccount }}>
          <MainRouter />
        </AccountContext.Provider>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
