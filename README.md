Deploy NodeJS application in ec2 server using lambda, API gateway, and DynamoDB.


 
Data Flow:-
1.	User visits your Node.js website hosted on EC2.
2.	EC2 app calls an API (via API Gateway) → e.g., POST /register.
3.	API Gateway routes that request to a Lambda function.
4.	Lambda executes backend logic (e.g., storing data in DynamoDB).
5.	Lambda returns the response back to the user via API Gateway → EC2 → browser.

Step 1: Set up the EC2 Server (Node.js App Hosting)
1.	Launch an EC2 Instance
o	Go to AWS Console → EC2 → Launch Instance.
o	Choose Amazon Linux 2 or Ubuntu.
o	Select instance type (e.g., t2.micro for testing).
o	Configure security group: allow port 22 (SSH) and port 3000 or 80 (HTTP).
2.	Connect via SSH
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip
3.	Install Node.js and Git
sudo yum update -y                # for Amazon Linux
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git
node -v
npm -v
4.	Your Node.js Application  
Mkdir Meesho Create a folder
cd Meeshochange directory
npm init -y 
npm install express body-parser node-fetch@2
npm install axios
Explanation:
Package	Purpose
express	        :-  Web framework for Node.js to build APIs and servers.
body-parser:-	Middleware to parse incoming request bodies (JSON, URL-encoded,      etc.). In newer Express versions, you can often use express.json() instead.
node-fetch@2:- Library to make HTTP requests (like fetch in browsers). Specifying @2 ensures you get version 2, because version 3 is ESM-only and may break CommonJS apps.
--Create app.js file in Meesho floder
Vi app.js
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

--Create  a public folder in  Meesho folder
cd Meesho 
mkdir public
cd public
vi index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MEESHO Registration</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
 }

    body {
      font-family: 'Arial', sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 10px;
    }

    .form-container {
      width: 100%;
      max-width: 400px;
      background:burlywood;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(128, 6, 6, 0.1);
      transition: all 0.3s ease;
    }

    .form-container:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    h2 {
      text-align: center;
      color:#ff3f6c;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .logo {
      display: block;
      margin: 0 auto 20px;
      width: 150px; /* Adjust the size of the logo */
      height: auto;
    }

    .form-group {
      margin-bottom: 20px;
      
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
  font-size: 16px;
      background-color: #fafafa;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #ff3f6c;  /* AJIO's main brand color */
      background-color: #fff;
    }

    button {
      width: 100%;
      padding: 14px;
      background-color: #ff3f6c; /* AJIO Ash color */
      border: none;
      border-radius: 5px;
      font-size: 16px;
      color: white;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    button:hover {
      background-color:brown; /* Darker shade for hover effect */
    }

    .form-footer {
      text-align: center;
      margin-top: 15px;
      font-size: 14px;
    }

    .form-footer a {
      text-decoration: none;
      color:brown;
      font-weight: bold;
    }

    .form-footer a:hover {
      text-decoration: underline;
    }

    .separator {
      text-align: center;
      margin: 20px 0;
      font-size: 16px;
      color:palevioletred;
}

    .separator span {
      background:chartreuse;
      padding: 0 10px;
    }
    
  </style>
</head>
<body>

  <div class="form-container">
    <!-- Embed the AJIO logo using base64 -->
    <img src="https://cdn.freelogovectors.net/wp-content/uploads/2023/11/meesho-logo-01_freelogovectors.net_.png" alt="AJIO Logo" class="logo">

    <h2>Register on MEESHO</h2>
    <form action="/register" method="POST">
      <div class="form-group">
        <input type="text" name="name" placeholder="Full Name" required />
      </div>
      <div class="form-group">
        <input type="email" name="email" placeholder="Email Address" required />
      </div>
      <div class="form-group">
        <input type="text" name="phone" placeholder="Phone Number" required />
      </div>
      <div class="form-group">
        <input type="password" name="password" placeholder="Password" required />
      </div>
      <button type="submit">Register</button>
      <div class="separator"><span>OR</span></div>
      <div class="form-footer">
        <h1>Already have  an meesho account? <a href="/login">Login here</a></h1>
      </div>
    </form>
  </div>

</body>
</html>
-Run and Test the Node.js App:
 •Start your application: node app.js
node Expected message: App running on http://localhost:3000 
Test it in your browser: http://<EC2-public-IP>:3000 
Output :
 

Step 2: Create DynamoDB Table via AWS Console
1.	Log in to AWS Console
o	Go to: https://console.aws.amazon.com/dynamodb
2.	Create a table
o	Click Create table.
o	Table name: Users (for example)
o	Primary key: email (String)
              Click Create.
                    Wait a few seconds — the table status will become Active.
 
   
Step 3:-Create Lambda Function:--
       1)  Go to AWS Lambda Console
1.	Log in to AWS Management Console.
2.	Navigate to Services → Lambda → Create function.
      2): Create Function
1.	Choose Author from scratch.
2.	Enter:
o	Function name: e.g., UserRegisterFunction
o	Runtime: Node.js 18.x (or your preferred Node.js version)
3.	Choose Execution role:
o	Option 1: Create a new role with basic Lambda permissions.
o	Option 2: Use an existing role (must have DynamoDB access if your function interacts with a database).
 
   
 

Step 3: Write Your Lambda Code
        1.Open the Code section of your Lambda function
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));  // Debug log for entire event

  let body;

  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    console.log('Parsed body:', body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  // Validation for required fields
  if (!body || !body.name || !body.email || !body.phone || !body.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing required user data: name, email, phone, and password." }),
    };
  }

  const user = {
    id: Date.now().toString(),
    name: body.name,
    email: body.email,
    phone: body.phone,
    password: body.password,
  };

 const params = {
    TableName: 'users',
    Item: user,
  };

  try {
    await dynamo.send(new PutCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully!" }),
    };
  } catch (error) {
    console.error('DynamoDB error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not save user", details: error.message }),
    };
  }
};

Step 4:Create API Gateway:--
      1) Open API Gateway Console
1.	Go to the AWS Management Console.
2.	Navigate to API Gateway → Create API.
3.	Choose HTTP API (recommended for Lambda).
(REST API is also fine, but HTTP API is faster and cheaper.)
 
 
   2) Create the API
1.	Click Build under “HTTP API.”
2.	In “Integrations,” select:
o	Lambda Function
o	Region: your Lambda’s region (e.g., ap-south-1)
o	Function: your Lambda function name (e.g., UserRegisterFunction)
3.	Click Next.
 
3) Configure Routes
Now define which URL path should call your Lambda function.
For example:
•	Method: POST
•	Resource path: /submit
Click Next.
 
 
 
4) Deploy the API
1.	Under Stages, create a new stage name — e.g., dev or prod.
2.	Click Deploy.
3.	After deployment, you’ll get an Invoke URL, like this:
             https://r3cxq22xs4.execute-api.ap-south-1.amazonaws.com/prod/submit
Copy this Invoke URL
Replace it in your application code wherever the API endpoint is used.
Replace this url in app.js
 







After setup is completed then start the :--- node app.js
 

 
After filed details stored to DynamoDb tables.-toExplore data table








