import discoverPatients from '../modules/discovery/discoverPatients.js';
import config from "../config/temp.js";
import refreshAccessToken from '../utils/refreshToken.js';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';


export default async function discoverController(query,headers) {
    if(!config.accessToken){
        await refreshAccessToken();
    }
    const patientInfo = discoverPatients(query);

    console.log(patientInfo);
    
    const body = {
        transactionId: query.transactionId,
        patient: patientInfo.patient,
        resp:{
            requestId: headers["request-id"]
        }
    }
    let response;
    try{
      response = await axios.post(
        "https://dev.abdm.gov.in/api/v3/hiecm/user-initiated-linking/patient/care-context/on-discover",
        body,
        {
          headers: {
            Authorization: `${config.gwApiConfig.headers.Authorization}`,
            "TIMESTAMP": new Date().toISOString(),
            "X-HIU-ID": "SBX_007421",
          }
        }
      );
    }catch(err){
        console.log(err);
    }
      // config.OTPDATABASE.push({patient: patientInfo.patient, transactionId: query.transactionId});

      config.OTPDATABASE.push({
        patient: patientInfo.patient,
        transactionId: query.transactionId,
        otp: null,
        linkReNumber: null,
      });
      console.log("discover",JSON.stringify(config.OTPDATABASE));
    
      return {
        status: response.status,
        statusText: response.statusText,
        data: response.config.data,
      };
}