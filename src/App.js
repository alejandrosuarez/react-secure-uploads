import React, { useState, useEffect } from 'react';
import './App.css';
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);

function App() {
  // State for the secure signature and expiration
  const [signature, setSignature] = useState(null);
  const [expire, setExpire] = useState(null);
  const [userID, setUserID] = useState(null); // State to store userID from URL

  // Fetch the secure signature when the component mounts
  useEffect(() => {
    async function fetchSignature() {
      try {
        const response = await fetch('bdf6dcd0a608bd0dacd7'); // Add here your Vercel signature generation serverless function
        const data = await response.json();

        if (response.ok) {
          setSignature(data.signature);
          setExpire(data.expire);
        }
      } catch (error) {
        console.error("Error fetching signature:", error);
      }
    }

    fetchSignature();
  }, []);

  // Extract userID parameter from the URL
  useEffect(() => {
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // Get userID from the URL
    const userIDFromURL = getParameterByName('userid');

    // Set userID state
    setUserID(userIDFromURL);
  }, []);

  // Effect to update LR configuration with metadata
  useEffect(() => {
    const config = document.querySelector('lr-config');
  
    if (config) {
      // Set metadata based on userID availability
      if (userID) {
        // Set metadata with userID from URL
        config.metadata = {
          userID: userID
        };
        console.log('Metadata with userID from URL:', config.metadata);
      } else {
        // Set metadata with hardcoded values
        config.metadata = {
          userID: 'f57ed45e-8d2e-4690-ae8e-37aed4583b5c' // Hardcoded userID value
        };
        console.log('Metadata with hardcoded userID:', config.metadata);
      }
    }
  }, [userID]);

  return (
    <div className="App">
      <header className="App-header">
        {/* Configuration */}
        <lr-config
          ctx-name="my-uploader"
          pubkey="bdf6dcd0a608bd0dacd7" // Add here your Uploadcare project public Key
          max-local-file-size-bytes="500000000"
          source-list="local, url"
          secure-signature={signature}  // Apply the secure signature
          secure-expire={expire}  // Apply the expiration date
          enable-audio-recording="true"
        ></lr-config>

        {/* Uploader */}
        <div className="uploader-container">
          <lr-file-uploader-regular
            css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.0/web/lr-file-uploader-regular.min.css"
            ctx-name="my-uploader"
            className="my-config"
          >
          </lr-file-uploader-regular>
        </div>
      </header>
    </div>
  );
}

export default App;
