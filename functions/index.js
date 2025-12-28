const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const expectedApiKey = "CHOOSE_A_STRONG_SECRET_KEY_123";

exports.logVitals = functions.https.onRequest(async (req, res) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
    return res.status(200).send();
  }

  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  try {
    const { bedId, heartRate, spo2, temperature } = req.body;
    
    if (!bedId || !heartRate || !spo2 || !temperature) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const vitalsData = {
      bedId,
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      temperature: Number(temperature),
      timestamp: new Date().toISOString()
    };

    // Save to Firestore
    const docRef = await admin.firestore()
      .collection('vitals')
      .add(vitalsData);

    return res.status(200).json({
      success: true,
      message: 'Vitals saved',
      documentId: docRef.id
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
