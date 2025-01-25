const express = require('express');
const cors = require('cors');

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
    res.send('Demo working');
})



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
