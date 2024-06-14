const express = require('express');
const getReviews = require('./getReviews')
app = express();

app.get('/', async (req, res) => {
    try {
        const data = await getReviews("https://www.google.com/maps/place/Tour+Eiffel/@48.8583736,2.292298,17z/data=!4m5!3m4!1s0x47e66e2964e34e2d:0x8ddca9ee380ef7e0!8m2!3d48.8583701!4d2.2944813")
        res.json(data);
    }catch(e) {
        res.send(e);
    }
})

app.listen(3000, () => {
    console.log("server on");
})