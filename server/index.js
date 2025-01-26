const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const {
    Cashfree
} = require('cashfree-pg');


require('dotenv').config();

const app = express();


// Apply CORS middleware with proper configuration
const corsOptions = {
    origin: "https://cashfreeclient.vercel.app", // Replace with your frontend domain
    methods: ["GET", "POST", "OPTIONS"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Allow cookies if needed
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;


function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);

    const orderId = hash.digest('hex');

    return orderId.substr(0,12);
}


app.get('/', (req, res) => {
    res.send('Hello World! working');
})


app.get('/demo', (req, res) => {
    try {
        res.send('Demo working');
    } catch (error) {
        console.error('Error in /demo route:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/payment', async (req, res) => {
    try {
        let request = {
            order_amount: 1.49,
            order_currency: "INR",
            order_id: await generateOrderId(),
            customer_details: {
                customer_id: "webcodder01",
                customer_phone: "9999999999",
                customer_name: "Web Codder",
                customer_email: "webcodder@example.com"
            },
        };

        Cashfree.PGCreateOrder("2023-08-01", request)
            .then(response => {
                console.log('Cashfree Response:', response.data); // Log successful response
                res.json(response.data);
            })
            .catch(error => {
                console.error('Cashfree API Error:', error.response?.data || error.message); // Log Cashfree error
                res.status(500).json({ error: 'Cashfree API error', details: error.response?.data });
            });

    } catch (error) {
        console.error('Server Error:', error); // Log unexpected server errors
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});



app.post('/verify', async (req, res) => {

    try {

        let { orderId } = req.body;
        
       Cashfree.PGCreateOrder("2023-08-01", request)
      .then((response) => {
        if (response && response.data) {
          console.log('Payment response:', response.data);
          res.json(response.data);
        } else {
          console.error('No response data from Cashfree');
          res.status(500).send('Failed to create order');
        }
      })
      .catch((error) => {
        console.error('Error from Cashfree:', error.message || error);
        res.status(500).send('Cashfree API Error');
      });



    } catch (error) {
        console.log(error);
    }
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
