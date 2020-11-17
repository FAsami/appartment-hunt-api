const express = require('express');
const mongoose = require('./db/mongoose');
const UserRouter = require('./routers/user')
const AppartmentRouter = require('./routers/appartment')
const BookingRouter = require('./routers/booking');
const app = express();
app.use(express.json())


app.use(UserRouter);
app.use(AppartmentRouter);
app.use(BookingRouter);


const PORT = 5000;
app.listen(PORT, () => console.log(`App is running on port ${PORT}`));