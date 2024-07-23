import axios from 'axios';
import config from '../config/temp.js';
import { v4 as uuidv4 } from 'uuid';

async function refreshAccessToken() {
  try {
    const sessionResponse = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/sessions",
      {
        clientId: "SBX_007421",
        clientSecret: "66cac0b2-3b43-4b19-8823-5833d339bfd4",
      }
    );
    config.accessToken = sessionResponse.data.accessToken;
    
    config.gwApiConfig = {
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "REQUEST-ID": uuidv4(),
        "TIMESTAMP": new Date().toISOString(),
        "X-HIP-ID": SBX_007421,
        "X-CM-ID": sbx
      },
    };
    return { accessToken: config.accessToken, gwApiConfig: config.gwApiConfig };
  } catch (error) {
    console.error('Error refreshing access token:', error.message);
    throw error;
  }
}

export default refreshAccessToken;