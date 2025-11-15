import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userId } = req.query;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;

    if (!ROBLOX_API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: API Key is missing.' });
    }

    // INI ADALAH ENDPOINT YANG LANGSUNG DAN SEDERHANA
    const url = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?limit=100&sortOrder=Asc`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': ROBLOX_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from Roblox API:', errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).json({ error: 'An internal error occurred' });
    }
}