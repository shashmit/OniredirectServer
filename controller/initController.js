import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import refreshAccessToken from '../utils/refreshToken.js';
import config from '../config/temp.js';
import findCareContext from '../modules/discovery/findCareContext.js';
import generateOTP from '../utils/randomGenerator.js';

export default async function initController(data, headers) {
  if(!config.accessToken){
    await refreshAccessToken();
  }

  const generatedLinkRefNumber = uuidv4();
  const requestId = uuidv4();
  const timestamp = new Date().toISOString();
  const body = {
    requestId: requestId,
    timestamp: timestamp,
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
  const careData = await findCareContext(data);
  const otp = generateOTP();
  console.log("init",JSON.stringify(careData.patient));

  const existingIndex = config.OTPDATABASE.findIndex(item => item.transactionId === data.transactionId);
  if (existingIndex !== -1) {
    config.OTPDATABASE[existingIndex] = {
      ...config.OTPDATABASE[existingIndex],
      otp: otp,
      patient: careData.patient,
      linkRefNumber: generatedLinkRefNumber
    };
  }
  try{
    const response = await axios.post(
      "https://dev.abdm.gov.in/gateway/v0.5/links/link/on-init",
      body,
      config.gwApiConfig
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