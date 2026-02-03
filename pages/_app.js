import "@/styles/globals.css";

//-------INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import NavBar from "../components/NavBar/NavBar";
import ConnectGate from "../components/ConnectGate/ConnectGate";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <NavBar />
      <ConnectGate>
        <Component {...pageProps} />
      </ConnectGate>
    </VotingProvider>
  );
}
