import "@/styles/globals.css";

//-------INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import { NavBar } from "../components/NavBar";

export default function App({ Component, pageProps }) {
  return (
    <VotingProvider>
      <NavBar />
      <div>
        <Component {...pageProps} />
      </div>
    </VotingProvider>
  );
}
