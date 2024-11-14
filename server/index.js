const express = require('express');
const cors = require('cors'); // Import cors middleware
const app = express();
const port = 8000;
const router = require("./routes");
app.use(express.json());
// Define CORS options
const corsOptions = {
    origin: 'http://localhost:3000', 
};
app.use(cors(corsOptions));
app.use('/product', router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
