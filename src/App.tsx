import * as solanaWeb3 from "@solana/web3.js";
import { useEffect, useState } from "react";
import "./App.css";

const TEST_GIFS = [
  "https://c.tenor.com/a3zQRRj3b_0AAAAd/test-peanuts-movie.gif",
  "https://c.tenor.com/a3zQRRj3b_0AAAAd/test-peanuts-movie.gif",
  "https://c.tenor.com/a3zQRRj3b_0AAAAd/test-peanuts-movie.gif",
  "https://c.tenor.com/a3zQRRj3b_0AAAAd/test-peanuts-movie.gif",
  ,
];

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gifList, setGifList] = useState<any>([]);

  const onInputChange = (event: any) => {
    const { value } = event.target;
    setInputValue(value);
  };
  const sendGif = async () => {
    if (inputValue.length > 0) {
      setGifList([...gifList, inputValue]);
      setInputValue("");
    } else {
      console.log("Empty input. Try again.");
    }
  };

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

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");

      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

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
        {walletAddress && (
          <>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendGif();
              }}
            >
              <input
                type="text"
                placeholder="Enter gif link!"
                style={{ padding: 10 }}
                value={inputValue}
                onChange={onInputChange}
              />
              <button
                type="submit"
                style={{ padding: 10, background: "orange" }}
              >
                Submit
              </button>
            </form>
            <div>
              {gifList.map((gif: any) => (
                <div key={gif}>
                  <img src={gif} alt={gif} />
                </div>
              ))}
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
