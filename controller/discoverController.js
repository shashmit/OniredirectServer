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
        patient: patientInfo.match,
        response:{
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
            Authorization: config.gwApiConfig.Authorization,
            "REQUEST-ID": uuidv4(),
            "TIMESTAMP": new Date().toISOString(),
            "X-CM-ID": "sbx",
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