import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';

async function addNewCareContext(req, res) {

    const { abhaNumber, abhaAddress,referenceNumber, display, careContexts, hiType, count} = req.body;
    if (!config.accessToken) {
        await refreshAccessToken();
    }
     const body = {
        abhaNumber,
        abhaAddress,
        patient: [
        {
            referenceNumber: referenceNumber,
            display,
            careContexts,
            hiType,
            count
        }
      ]
    }

    console.log(body);
    const abhaId = abhaAddress;
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