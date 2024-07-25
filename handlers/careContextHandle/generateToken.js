import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';
import { v4 as uuidv4 } from 'uuid';

async function generateToken(req, res) {
  const { abhaNumber, abhaAddress, name, gender, dob } = req.body;
  
  if (!config.accessToken) {
      try {
          await refreshAccessToken();
      } catch (error) {
          console.error('Error refreshing token:', error.message);
          return res.status(500).json({ status: "error", message: "Failed to refresh access token" });
      }
  }
  
  const body = {
      abhaNumber,
      abhaAddress,
      name,
      gender,
      yearOfBirth: dob
  };
  
  try {
      const response = await axios.post(
          'https://dev.abdm.gov.in/hiecm/api/v3/token/generate-token',
          body,
          {
            headers:{
                Authorization: config.gwApiConfig.Authorization,
                "REQUEST-ID": uuidv4(),
                "TIMESTAMP": new Date().toISOString(),
                "X-HIP-ID": "SBX_007421",
                "X-CM-ID": "sbx"
            }
          }
      );
      res.status(200).json(response.data);
  } catch (err) {
      console.error('Error:', err.message);
      if (err.response) {
          res.status(err.response.status).json({ status: "error", message: err.response.data.message || "Error from server" });
      } else {
          res.status(500).json({ status: "error", message: "Internal server error" });
      }
  }
}


export default generateToken;