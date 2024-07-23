import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';

async function generateToken(req, res) {
  const { abhaNumber, abhaAddress, name, gender, dob} = req.body
  if (!config.accessToken) {
    await refreshAccessToken();
  }
  const body ={
    abhaNumber: abhaNumber,
    abhaAddress: abhaAddress,
    name: name,
    gender: gender,
    dob: dob
  }
  try{
    const response = await axios.post(
      'https://dev.abdm.gov.in/hiecm/api/v3/token/generate-token',
      body,
      config.gwApiConfig
    );
    return res.status(200).json(response.data);
  }catch(err){
    console.error('Error:', err.message);
    return res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export default generateToken;