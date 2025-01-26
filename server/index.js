const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const {
    Cashfree
} = require('cashfree-pg');


require('dotenv').config();

const app = express();

const corsOptions = {
    origin: "https://cashfreeclient.vercel.app", // Allow your frontend origin
    methods: ["GET", "POST"], // Specify allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};

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
        const orderId = generateOrderId();
        const request = {
            order_amount: 1.49,
            order_currency: "INR",
            order_id: orderId,
            customer_details: {
                customer_id: "webcodder01",
                customer_phone: "9999999999",
                customer_name: "Web Codder",
                customer_email: "webcodder@example.com",
            },
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        if (response.data) {
            console.log(response.data);
            res.json(response.data);
        } else {
            console.error("Cashfree response is empty");
            res.status(500).send("Failed to create order");
        }
    } catch (error) {
        console.error("Error in /payment:", error.message || error);
        res.status(500).send("Internal Server Error");
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
