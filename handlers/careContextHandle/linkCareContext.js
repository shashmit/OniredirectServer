import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';
import refreshAccessToken from '../../utils/refreshToken.js';

async function linkCareContext(req, res) {
    const data = req.body;
    if (!config.accessToken) {
        await refreshAccessToken();
    }
     const body = {
        abhaNumber: data.abhaNumber,
        abhaAddress: data.abhaAddress,
        patient: data.patient,
    }
    const abhaId = data.abhaAddress;
    console.log(config.tempDatabase[abhaId]);

    try {
        const response = await axios.post(
            'https://dev.abdm.gov.in/hiecm/api/v3/link/carecontext',
            body,
            {
              headers: {
                "REQUEST-ID": uuidv4(),
                "TIMESTAMP": new Date().toISOString(),
                Authorization: config.gwApiConfig.Authorization,
                "X-HIP-ID": "SBX_007421",
                "X-CM-ID": "sbx",
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

export default linkCareContext;