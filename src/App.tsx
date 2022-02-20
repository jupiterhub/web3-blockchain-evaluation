import * as solanaWeb3 from "@solana/web3.js";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana }: any = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          /*
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet!
           *
           * see https://docs.phantom.app/integrating/establishing-a-connection#eagerly-connecting for options
           */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana }: any = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    console.log(solanaWeb3);
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>A simple application for testing web3 and decentralized app</p>
        {!walletAddress && (
          <button
            style={{ padding: 10, background: "orange" }}
            onClick={connectWallet}
          >
            Connect to Wallet
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
