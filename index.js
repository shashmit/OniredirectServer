const express = require('express');
const app = express();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;
app.use(express.json());

app.use(express.json());

let accessToken = null;
let gwApiConfig = null;


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


app.all('*', async (req, res) => {
    try {
        if (!accessToken) {
          await refreshAccessToken();
        }
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const data = req.body;
        const path = req.path;
        console.log(`Received request on path: ${path}`);
        
        // Here you can use the accessToken, requestId, and timestamp as needed
    
        res.status(200).json({ status: "success", message: "Event processed" });
      } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
      }
});

app.post("/auth/init", async (req, res) => {
    if (!accessToken) {
          await refreshAccessToken();
    }
    const requestId = uuidv4();
    const timestamp = new Date().toISOString();
    // const data = req.body;
    // const path = req.path;
    const body = {
        requestId: requestId,
        timestamp: timestamp,
        query: {
          id: "91343432822736@sbx",
          purpose: "KYC_AND_LINK",
          requester: {
            type: "HIP",
            id: "SBX_007421"
          }
        }
      };
      const response = await axios.post(
        "https://dev.abdm.gov.in/gateway/v0.5/users/auth/init",
        body,
        gwApiConfig
      );
      console.log('Response:', response.data);
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});