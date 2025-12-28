const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const expectedApiKey = "CHOOSE_A_STRONG_SECRET_KEY_123";

exports.logVitals = functions.https.onRequest(async (req, res) => {
  // 1. Check API key
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (apiKey !== expectedApiKey) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  // 2. Handle CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  // 3. Only accept POST
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST requests allowed' });
  }

  try {
    const { bedId, heartRate, spo2, temperature } = req.body;

    // 4. Validate
    if (!bedId || heartRate === undefined || spo2 === undefined || temperature === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // 5. Prepare data
    const vitalsData = {
      bedId,
      heartRate: Number(heartRate),
      spo2: Number(spo2),
      temperature: Number(temperature),
      timestamp: new Date().toISOString(),
      receivedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // 6. Save to Firestore
    const docRef = await admin.firestore()
      .collection('vitals')
      .add(vitalsData);

    // 7. Response
    return res.status(200).json({
      success: true,
      message: 'Vitals saved',
      documentId: docRef.id
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
});
