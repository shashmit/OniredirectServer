const express = require('express');
const app = express();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;
const session = require('express-session');
app.use(express.json());

app.use(express.json());

let accessToken = null;
let gwApiConfig = null;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour
}));

let tId = null;

async function refreshAccessToken() {
  try {
    const sessionResponse = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/sessions",
      {
        clientId: "SBX_007421",
        clientSecret: "66cac0b2-3b43-4b19-8823-5833d339bfd4",
      }
    );
    accessToken = sessionResponse.data.accessToken;
    gwApiConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-CM-ID": "sbx",
      },
    };
    console.log('Access token refreshed');
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
  }
}


app.all('/hip/*', async (req, res) => {
    try {
        if (!accessToken) {
          await refreshAccessToken();
        }
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const data = req.body;
        const path = req.path;
        console.log(`Received request on path: ${path}`);
        console.log('Request:', data)
        
        // Here you can use the accessToken, requestId, and timestamp as needed
        if(path === "/hip/v0.5/users/auth/on-init"){
          req.session.lastTransactionId = data.auth.transactionId;
          tId = data.auth.transactionId;
        }
    
        res.status(200);
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
      }
});

app.post('/init-auth', async (req, res) => {
  try {
    if (!accessToken) {
      await refreshAccessToken();
    }

    const requestId = uuidv4();
    const timestamp = new Date().toISOString();

    // Allow Postman to set the 'id' in the query
    const { id } = req.body;

    const requestBody = {
      requestId: requestId,
      timestamp: timestamp,
      query: {
        id: id, // This will be set by Postman
        purpose: "KYC_AND_LINK",
        authMode: "DEMOGRAPHICS",
        requester: {
          type: "HIP",
          id: "SBX_007421"
        }
      }
    };

    const response = await axios.post(
      'https://dev.abdm.gov.in/gateway/v0.5/users/auth/init',
      requestBody,
      gwApiConfig
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.post('/confirm-auth', async (req, res) => {
  try {
    if (!accessToken) {
      await refreshAccessToken();
    }

    const requestId = uuidv4();
    const timestamp = new Date().toISOString();

    // Get demographic data from Postman request
    const { name, gender, dateOfBirth } = req.body;

    // Retrieve the transactionId from the session
    const transactionId = req.session.lastTransactionId;
    console.log('Transaction ID:', transactionId);
    console.log('TID:', tId);

    if (!transactionId) {
      return res.status(400).json({ status: "error", message: "No transaction ID found. Please perform on-init first." });
    }

    const requestBody = {
      requestId: requestId,
      timestamp: timestamp,
      transactionId: transactionId || tId,
      credential: {
        demographic: {
          name: name,
          gender: gender,
          dateOfBirth: dateOfBirth
        }
      }
    };

    const response = await axios.post(
      'https://dev.abdm.gov.in/gateway/v0.5/users/auth/confirm',
      requestBody,
      gwApiConfig
    );
    
    console.log('Response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});