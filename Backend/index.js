const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


const mongoURI = "mongodb://localhost:27017/wathare_infotech";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const wathareSchema = new mongoose.Schema({
    ts: { type: Date, required: true },
    machine_status: { type: Number, required: true },
    vibration: { type: Number, required: true },
});

const wathareData = mongoose.model('wathareCollection', wathareSchema);

app.use(cors());
app.use(bodyParser.json());


const wathareData = require('./wathareData.json');

wathareData.deleteMany({}, (err) => {
    if (err) console.error(err);
    wathareData.insertMany(wathareData, (err) => {
        if (err) console.error(err);
        console.log('data imported');
    });
});


app.get('/dataForStatistics', async (req, res) => {
    const startTime = req.query.start_time ? new Date(req.query.start_time) : null;
    const endTime = req.query.end_time ? new Date(req.query.end_time) : null;
    const frequency = req.query.frequency || "hour";

    let query = {};
    if (startTime && endTime) {
        query.timestamp = { $gte: startTime, $lte: endTime };
    }

    try {
        const data = await wathareData.find(query);
        const summary = calculateSummary(data);
        res.json({ data, summary });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching data' });
    }
});

function calculateSummary(data) {
    const numOnes = data.filter(d => d.sample === 1).length;
    const numZeros = data.length - numOnes;
    return { numOnes, numZeros };
}
//------------------------------------------------------------------------------

app.get('/summaryOfAllData', async (req, res) => {
    try {
        const result = await WathareModel.aggregate([
            {
                $group: {
                    _id: "$machine_status",
                    count: { $sum: 1 }
                }
            }
        ]);

        let onesCount = 0;
        let zerosCount = 0;

        result.forEach(doc => {
            if (doc._id === 1) {
                onesCount = doc.count;
            } else if (doc._id === 0) {
                zerosCount = doc.count;
            }
        });

        const docs = await WathareModel.find({}, { machine_status: 1, _id: 0 }).sort({ ts: 1 });

        let variations = 0;
        let currentStatus = null;
        let continuousVariations = 0;

        docs.forEach(doc => {
            if (doc.machine_status !== currentStatus) {
                variations++;
                continuousVariations = 1;
                currentStatus = doc.machine_status;
            } else {
                continuousVariations++;
            }
        });

        res.json({
            onesCount: onesCount,
            zerosCount: zerosCount,
            continuousVariations: variations
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//-----------------------------------------------------------------------------
//generation simulator
const generateAndStoreData = () => {
    const sampleValue = Math.random() < 0.5 ? 0 : 1;
    const sample = new Sample({ value: sampleValue });
    sample.save()
        .then(() => console.log(`Sample data storedn: ${sampleValue}`))
        .catch(error => console.error('Error storing sample data:', error));
};

setInterval(generateAndStoreData, 1000);

app.get('/samples', async (req, res) => {
    try {
        const samples = await Sample.find().sort({ timestamp: 1 });
        res.json(samples);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//------------------------------------------------------------------------------
app.listen(port, () => console.log(`Server running on port ${port}`));
