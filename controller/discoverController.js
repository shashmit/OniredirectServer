import discoverPatients from '../modules/discovery/discoverPatients.js';
import config from "../config/temp.js";
import refreshAccessToken from '../utils/refreshToken.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import generateOTP from '../utils/randomGenerator.js';

export default async function discoverController(query,headers) {
    if(!config.accessToken){
        await refreshAccessToken();
    }
    const patientInfo = await discoverPatients(query);
    const requestId = uuidv4();
    const timestamp = new Date().toISOString();
    const body = {
        requestId: requestId,
        timestamp: timestamp,
        transactionId: query.transactionId,
        patient: patientInfo.patient,
        resp:{
            requestId: headers["request-id"]
        }
    }
    const response = await axios.post(
        "https://dev.abdm.gov.in/gateway/v0.5/care-contexts/on-discover",
        body,
        config.gwApiConfig
      );
    // generate a 6 digit random number and convert it to string
      const otp = generateOTP();
      config.OTPDATABASE.push({otp, patient: patientInfo.patient, transactionId: query.transactionId});
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.config.data,
      };
}