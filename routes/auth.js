import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import config from "../config/temp.js";
import refreshAccessToken from '../utils/refreshToken.js';

const router = express.Router();

router.post('/init', async (req, res) => {
    try {
        if (!config.accessToken) {
            await refreshAccessToken();
        }
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const { id } = req.body;
        const requestBody = {
            requestId: requestId,
            timestamp: timestamp,
            query: {
                id: id,
                purpose: "KYC_AND_LINK",
                authMode: "DEMOGRAPHICS",
                requester: {
                    type: "HIP",
                    id: "SBX_007421"
                }
            }
        };
        const response = await axios.post(
            'https://dev.abdm.gov.in/gateway/v0.5/users/auth/init',
            requestBody,
            config.gwApiConfig
        );
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

router.post('/confirm', async (req, res) => {
    try {
        if (!config.accessToken) {
            await refreshAccessToken();
        }
        const requestId = uuidv4();
        const timestamp = new Date().toISOString();
        const { name, gender, dateOfBirth } = req.body;
        if (!config.transactionId) {
            return res.status(400).json({ status: "error", message: "Transaction ID not found" });
        }
        console.log('TID:', config.transactionId);
        const requestBody = {
            requestId: requestId,
            timestamp: timestamp,
            transactionId: config.transactionId,
            credential: {
                demographic: {
                    name: name,
                    gender: gender,
                    dateOfBirth: dateOfBirth
                }
            }
        };
        const response = await axios.post(
            'https://dev.abdm.gov.in/gateway/v0.5/users/auth/confirm',
            requestBody,
            config.gwApiConfig
        );
        console.log('Response:', response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
});

export default router;