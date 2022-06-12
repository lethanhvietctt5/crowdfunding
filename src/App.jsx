import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Banner from "components/Banner";
import Footer from "components/Footer";
import Header from "components/Header";

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="App w-full min-h-screen flex flex-col justify-between">
        <div>
          <Header />
          <Banner />
        </div>
        <Footer />
      </div>
    </ChakraProvider>
  );
}

export default App;
