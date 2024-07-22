import express from 'express'
const router = express.Router()
import config from "../config/temp.js"
import refreshAccessToken from '../utils/refreshToken.js'
import discoverController from '../controller/discoverController.js'
import initController from '../controller/initController.js'
import confirmController from '../controller/confirmController.js'

router.all('/*', async (req, res, next) => {
  try {
      if (!config.accessToken) {
          await refreshAccessToken();
      }
      const data = req.body;
      const path = req.path;
      const headers = req.headers;
      console.log(`Received request on path: ${path}`);
      console.log("--------------------------------------------------------------------------------");
      console.log('Request:', JSON.stringify(data));
      console.log("--------------------------------------------------------------------------------");
      console.log('Headers:', JSON.stringify(headers));

      switch (true) {
          case path === "/v0.5/users/auth/on-init":
              config.transactionId = data.auth.transactionId;
              res.status(200).send();
              break;

          case path === "/v0.5/users/auth/on-confirm":
              const abhaId = data.auth.patient.id;
              config.tempDatabase[abhaId] = data.auth.accessToken;
              res.status(200).send();
              break;

          case path === '/api/v3/hip/patient/care-context/discover':
              const result = await discoverController(data, headers);
              res.status(200).json(result);
              break;

          case path === "/api/v3/hip/link/care-context/init":
              const initResult = await initController(data, headers);
              res.status(200).json(initResult);
              break;
          case path === "/api/v3/hip/link/care-context/confirm":
              const confirmResult = await confirmController(data,headers);
              res.status(200).json(confirmResult);
              break;
          case path === "/v0.5/patients/on-find":
                const id = data.patient.id;
                config.TEMP_PATIENTS_SEARCH_RESULT[id] = data;
                console.log("temp",config.TEMP_PATIENTS_SEARCH_RESULT[id])
                res.status(200).send();
          default:
              res.status(404).json({ message: "Endpoint not found" });
      }
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
});


export default router;