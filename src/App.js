import React, { useState, useEffect } from 'react'; // Import useEffect for lifecycle methods
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3'; // Import Web3

// Contract Address and ABI
const ADDRESS = "0x0f568c487a0fEB05202379F689f7D79CFfef5176"; // Updated contract address
const ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "startingPoint", "type": "uint256" },
      { "internalType": "string", "name": "startingMessage", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "decreaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumber",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "message",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "number",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "newMessage", "type": "string" }],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [number, setNumber] = useState(0); // Initialize number to 0
  const [message, setMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  // Initialize the Web3 object
  const web3 = new Web3(window.ethereum);

  // Instantiate the contract with ABI and address
  const myContract = new web3.eth.Contract(ABI, ADDRESS);

  // Function to get the current number from the contract
  const getNumber = async () => {
    try {
      const result = await myContract.methods.getNumber().call();
      return result; // Return the number fetched from the contract
    } catch (error) {
      console.error("Error fetching number:", error);
      return 0; // Return 0 or some default value in case of an error
    }
  };

  // Function to get the current message from the contract
  const getMessage = async () => {
    try {
      const result = await myContract.methods.message().call(); // Call the message function
      return result; // Return the message fetched from the contract
    } catch (error) {
      console.error("Error fetching message:", error);
      return ""; // Return empty string in case of an error
    }
  };

  // Use Effect to get the initial number and message when the component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      const initialNumber = await getNumber();
      const initialMessage = await getMessage();
      setNumber(initialNumber);
      setMessage(initialMessage);
    };

    fetchInitialData();
  }, [getNumber, getMessage]); // Added functions to dependency array

  // Function to increase the number in the contract
  async function increaseNumber() {
    try {
      const accounts = await web3.eth.requestAccounts();
      await myContract.methods.increaseNumber().send({ from: accounts[0] });
      const updatedNumber = await getNumber(); // Fetch updated number from the contract
      setNumber(updatedNumber); // Update state
    } catch (error) {
      console.error("Error increasing number:", error);
    }
  }

  // Function to decrease the number in the contract
  async function decreaseNumber() {
    try {
      const accounts = await web3.eth.requestAccounts();
      await myContract.methods.decreaseNumber().send({ from: accounts[0] });
      const updatedNumber = await getNumber(); // Fetch updated number from the contract
      setNumber(updatedNumber); // Update state
    } catch (error) {
      console.error("Error decreasing number:", error);
    }
  }

  // Function to update the message in the contract
  async function updateMessage() {
    try {
      const accounts = await web3.eth.requestAccounts();
      await myContract.methods.setMessage(inputMessage).send({ from: accounts[0] });
      const updatedMessage = await getMessage(); // Refresh the message after updating
      setMessage(updatedMessage); // Update state
    } catch (error) {
      console.error("Error updating message:", error);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <button onClick={getNumber}>Get Number</button>
        <p>Number: {number}</p>

        <button onClick={getMessage}>Get Message</button>
        <p>Message: {message}</p>

        <button onClick={increaseNumber}>Increase Number</button>
        <button onClick={decreaseNumber}>Decrease Number</button>

        <input 
          type="text" 
          placeholder="Update Message" 
          value={inputMessage} 
          onChange={(e) => setInputMessage(e.target.value)} 
        />
        <button onClick={updateMessage}>Update Message</button>
      </header>
    </div>
  );
}

export default App;
