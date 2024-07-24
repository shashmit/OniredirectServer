import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';

async function addNewCareContext(req, res) {
    const data = req.body;
    if (!config.accessToken) {
        await refreshAccessToken();
    }
     const body = {
        abhaNumber: data.abhaNumber,
        abhaAddress: data.abhaAddress,
        patient: [
        {
            referenceNumber: data.patient.referenceNumber,
            display: data.patient.display,
            careContexts: data.patient.careContexts,
            hiType: data.patient.hiType,
            count: data.patient.count
        }
      ]
    }

    console.log(req.body);
    const abhaId = data.abhaAddress;
    try {
        const response = await axios.post(
            'https://dev.abdm.gov.in/hiecm/api/v3/link/carecontext',
            body,
            {
              headers: {
                ...config.gwApiConfig.headers,
                "X-LINK-TOKEN": config.tempDatabase[abhaId]
              }
            }
          );
          res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export default addNewCareContext;