const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
cons

const app = express();
app.use(morgan('dev'));
app.use(cors());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${port}`));