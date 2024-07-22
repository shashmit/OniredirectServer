import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import config from "../config/temp.js";
import refreshAccessToken from '../utils/refreshToken.js';

const router = express.Router();

router.post("/consent/init", async (req, res) => {
    try {
        if (!config.accessToken) {
            await refreshAccessToken();
        }
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const body = {
          requestId: requestId,
          timestamp: timestamp,
          consent: {
            purpose: {
              text: req.body.purpose?.text,
              code: req.body.purpose?.code
            },
            patient: {
              id: req.body.patient?.id
            },
            hiu: {
              id: req.body.hiu?.id
            },
            requester: {
              name: req.body.requester?.name,
              identifier: {
                type: req.body.requester?.identifier?.type,
                value: req.body.requester?.identifier?.value,
                system: req.body.requester?.identifier?.system
              }
            },
            hiTypes: req.body.hiTypes,
            permission: {
              accessMode: req.body.permission?.accessMode,
              dateRange: {
                from: req.body.permission?.dateRange?.from,
                to: req.body.permission?.dateRange?.to
              },
              dataEraseAt: req.body.permission?.dataEraseAt,
              frequency: {
                unit: req.body.permission?.frequency?.unit,
                value: req.body.permission?.frequency?.value,
                repeats: req.body.permission?.frequency?.repeats
              }
            }
          }
        };

        const response = await axios.post(
          "https://dev.abdm.gov.in/gateway/v0.5/consent-requests/init",
          body,
          config.gwApiConfig
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.post("/consent/find/patient", async (req, res) => {
  try{
    if (!config.accessToken) {
      await refreshAccessToken();
  }
  const requestId = uuidv4();
  const timestamp = new Date().toISOString();
  const body = {
    requestId: requestId,
    timestamp: timestamp,
    query: {
      patient: {
        id: req.body.patient?.id
      },
      requester:{
        type: req.body.requester?.type,
        id: req.body.requester?.id
      }
    }
  };
  const patient = await config.TEMP_PATIENTS_SEARCH_RESULT[req.body.patient?.id];
  console.log(patient)
  const response = await axios.post(
    "https://dev.abdm.gov.in/gateway/v0.5/patients/find",
    body,
    config.gwApiConfig
  );
  res.status(200).json(patient);
  
  }catch(e){
    console.error('Error:', error.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
})

export default router;