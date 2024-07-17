import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import config from '../../config/temp.js';

async function addCareContext(req, res) {
    const { referenceNumber, display, careContext, abhaId } = req.body;

    try {
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const data = {
            requestId: requestId,
            timestamp: timestamp,
            link: {
                accessToken: config.tempDatabase[abhaId],
                patient: {
                    referenceNumber: referenceNumber,
                    display: display,
                    careContexts: careContext,
                }
            }
        };

        const response = await axios.post(
            'https://dev.abdm.gov.in/gateway/v0.5/links/link/add-contexts',
            data,
            config.gwApiConfig
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export { addCareContext };