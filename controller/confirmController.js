import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import refreshAccessToken from '../utils/refreshToken.js';
import config from '../config/temp.js';

export default async function confirmController(data, headers) {
  if (!config.accessToken) {
    await refreshAccessToken();
  }

  const { token: receivedOTP, linkRefNumber } = data.confirmation;
  const requestId = uuidv4();
  const timestamp = new Date().toISOString();

  const otpEntry = config.OTPDATABASE.find(x => x.linkRefNumber === linkRefNumber);

  if (!otpEntry) {
    throw new Error("Link Ref Number not found");
  }

  if (receivedOTP !== otpEntry.otp) {
    throw new Error("Invalid OTP");
  }

  const body = {
    requestId,
    timestamp,
    patient: otpEntry.patient,
    error: null,
    resp: {
      requestId: headers["request-id"],
    }
  };

  try {
    const response = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/links/link/on-confirm",
      body,
      config.gwApiConfig
    );

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data, // Changed from response.config.data to response.data
    };
  } catch (error) {
    console.error('Error in confirmController:', error);
    throw error; // Re-throw the error instead of creating a new one
  }
}