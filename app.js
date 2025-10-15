const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON data
app.use(express.static("public")); // Serve static files (HTML, CSS, JS)

// Serve the registration form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle the form submission
app.post("/register", async (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };

  try {
    // Send POST request to Lambda/API Gateway endpoint
    const response = await axios.post(
      "https://r3cxq22xs4.execute-api.ap-south-1.amazonaws.com/prod/submit", // Replace with your endpoint
      userData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (response.status === 200) {
      res.send("Registration successful!");
    } else {
      res.status(500).send("Failed to register user.");
    }
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).send("Error submitting registration.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

