import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';

async function notifyUser(req, res) {
  const { phoneNo } = req.body;
  if (!config.accessToken) {
    await refreshAccessToken();
}
  try {
    const requestId = uuidv4();
    const timestamp = new Date().toISOString();

    const body = {
      requestId: requestId,
      timestamp: timestamp,
      notification: {
        phoneNo: phoneNo,
        hip: {
          name: "Onicares",
          id: "IN3410000818"
        }
      }
    };

    const response = await axios.post(
      'https://dev.abdm.gov.in/gateway/v0.5/patients/sms/notify2',
      body,
      config.gwApiConfig // Assuming this is defined in your config file
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
}

export { notifyUser };