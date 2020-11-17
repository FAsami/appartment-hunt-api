const mongoose = require('mongoose')
const donenv = require('dotenv');
donenv.config();
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});