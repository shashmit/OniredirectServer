import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import refreshAccessToken from '../utils/refreshAccessToken';
import config from '../config/temp.js';

export default async function initController(data, headers) {
  if(!config.accessToken){
    await refreshAccessToken();
  }
  const generatedLinkRefNumber = uuidv4();
  const body = {
    requestId,
    timestamp,
    transactionId: data.transactionId,
    link: {
      referenceNumber: generatedLinkRefNumber,
      authenticationType: "DIRECT",
      meta: {
        communicationMedium: "MOBILE",
        communicationHint: "OTP",
        communicationExpiry: new Date(+new Date() + 86400000).toISOString(),
      },
    },
    error: null,
    resp: {
      requestId: headers["request-id"],
    },
  };
  try{
    const response = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/links/link/on-init",
      body,
      congif.gwApiConfig
    );
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.config.data,
    };
  }catch(err){
    console.log(err);
    throw new Error(err);
  }
}