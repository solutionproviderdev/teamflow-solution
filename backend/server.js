const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./lib/db');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB()
 
// Test GET API – Check if server is running
app.get('/', (req, res) => {
	res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Server Status</title>
        <style>
          body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
          }
          .emoji {
            font-size: 48px;
          }
          .msg {
            font-size: 20px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="emoji">✅</div>
          <div class="msg">Server is alive and working!</div>
        </div>
      </body>
      </html>
    `);
});
 


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
