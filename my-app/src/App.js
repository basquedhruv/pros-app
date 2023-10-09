import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Card } from "react-bootstrap"; 
import "bootstrap/dist/css/bootstrap.min.css"; 

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState(0);
  const [inputText, setInputText] = useState('');
  const [maxConsecutiveChars, setMaxConsecutiveChars] = useState([]);
  const [inputArray, setInputArray] = useState('');
  const [targetSum, setTargetSum] = useState('');
  const [pairs, setPairs] = useState([]);

  const [data, setdata] = useState({ 
    address: "", 
    Balance: null, 
  }); 

  const findPairs = () => {
    const nums = inputArray
      .split(',')
      .map((numStr) => parseInt(numStr.trim(), 10));

    const pairSet = new Set();
    const result = [];

    for (let i = 0; i < nums.length; i++) {
      const complement = targetSum - nums[i];
      if (pairSet.has(complement)) {
        result.push([nums[i], complement]);
      }
      pairSet.add(nums[i]);
    }

    setPairs(result);
  };
  
  // Button handler button for handling a 
  // request event for metamask 
  const btnhandler = () => { 
  
    // Asking if metamask is already present or not 
    if (window.ethereum) { 
  
      // res[0] for fetching a first wallet 
      window.ethereum 
        .request({ method: "eth_requestAccounts" }) 
        .then((res) => accountChangeHandler(res[0])); 
    } else { 
      alert("install metamask extension!!"); 
    } 
  }; 
  
  // getbalance function for getting a balance in 
  // a right format with help of ethers 
  const getbalance = (address) => { 
  
    // Requesting balance method 
    window.ethereum 
      .request({  
        method: "eth_getBalance",  
        params: [address, "latest"]  
      }) 
      .then((balance) => { 
        // Setting balance 
        setdata({ 
          Balance: ethers.formatEther(balance), 
          address: address
        }); 
      }); 
  }; 
  
  // Function for getting handling all events 
  const accountChangeHandler = (account) => { 
    // Setting an address data 
    setdata({ 
      address: account, 
    }); 
  
    // Setting a balance 
    getbalance(account); 
  }; 

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);
          const weiBalance = await web3Instance.eth.getBalance(accounts[0]);
          const ethBalance = web3Instance.utils.fromWei(weiBalance, 'ether');
          setBalance(ethBalance);
        } catch (error) {
          console.error(error);
          toast.error('Error connecting to the wallet.');
        }
        setWeb3(web3Instance);
      } else {
        toast.error('No Ethereum wallet detected. Please install Metamask.');
      }
    };
  
    // Mouse move event listener
    const handleMouseMove = (e) => {
      setMousePosition(e.clientX);
    };
  
    window.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array indicates this effect should only run once (on mount)
  

  const handleShowTimeClick = () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Current Time: ${currentTime}`);
    setClickCount(clickCount + 1);

    // Show time as a toast notification
    toast.info(`Current Time: ${currentTime}`, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Toast will close after 2 seconds
    });
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    findMaxConsecutiveChars(text);
  };

  const findMaxConsecutiveChars = (text) => {
    // Logic to find max consecutive characters
    // ...

    // Example logic (replace this with your own implementation)
    let maxCount = 0;
    let charMap = {};

    for (let i = 0; i < text.length; i++) {
      charMap[text[i]] = (charMap[text[i]] || 0) + 1;
      maxCount = Math.max(maxCount, charMap[text[i]]);
    }

    const maxChars = Object.keys(charMap).filter(key => charMap[key] === maxCount);
    setMaxConsecutiveChars(maxChars.map(char => `${char}: ${maxCount}`));
  };

  return (
    <div className="App" style={{ backgroundColor: `rgb(0, ${mousePosition % 256}, 0)` }}>
      
      <button onClick={handleShowTimeClick}>Show Current Time</button>
      <ToastContainer /> {/* Include the ToastContainer at the root level */}
      <p>Number of Clicks: {clickCount}</p>
      <p>Component Rendering Count: {clickCount + 1}</p>
      <input
        type="text"
        placeholder="Enter text"
        value={inputText}
        onChange={handleInputChange}
      />
      <p>Max Consecutive Chars: {maxConsecutiveChars.join(', ')}</p> 
      <div>
      <h2>Find Pairs of Numbers</h2>
      <div>
        <label>
          Enter Array (comma-separated):
          <input
            type="text"
            value={inputArray}
            onChange={(e) => setInputArray(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Enter Target Sum:
          <input
            type="number"
            value={targetSum}
            onChange={(e) => setTargetSum(e.target.value)}
          />
        </label>
      </div>
      <button onClick={findPairs}>Find Pairs</button>
      <h3>Pairs:</h3>
      <ul>
        {pairs.map((pair, index) => (
          <li key={index}>{`[${pair.join(', ')}]`}</li>
        ))}
      </ul>
    </div>
    <Card className="text-center"> 
        <Card.Header> 
          <strong>Address: </strong> 
          {data.address} 
        </Card.Header> 
        <Card.Body> 
          <Card.Text> 
            <strong>Balance: </strong> 
            {data.Balance} 
          </Card.Text> 
          <Button onClick={btnhandler} variant="primary"> 
            Connect to wallet 
          </Button> 
        </Card.Body> 
      </Card>
    </div>
  );
};

export default App;
