import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

// Initialize the Express application
const app = express();

// Define the port number on which the Express server will listen for requests
const port = 3000;

// Apply the CORS middleware to allow cross-origin requests from web browsers
app.use(cors());

// Apply middleware to parse the body of HTTP requests as JSON
// This will enable you to access the body of POST or PUT requests as a JavaScript object via `req.body`
app.use(express.json());

app.use(productRoutes)

// Start the Express server on the defined port and log a message to the console
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

