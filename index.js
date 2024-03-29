const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const { Script } = require("vm");

const app = express();
const port = 3000;

// Create a connection pool to the database
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust as needed
  host: "localhost",
  user: "root",
  password: "charanba",
  database: "atsdata",
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the directory where your index.html is located
const htmlPath = path.join(
  "C:",
  "Users",
  "dell",
  "ATS-power-solutions-pvt-ltd",
  "desinic-master"
);

// Serve the HTML file with the button
app.get("/", (req, res) => {
  // Serve index.html from the specified location
  res.sendFile(path.join(htmlPath, "index.html"));
});

// Serve the page with the form
app.get("/enquiry", (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Enquiry Form</h1>
        <form action="/submit" method="post">
          <label>Name:</label>
          <input type="text" name="name" required><br>
          <label>Email:</label>
          <input type="email" name="email" required><br>
          <label>Phone No:</label>
          <input type="text" name="phone" required><br>
          <input type="submit" value="Submit">
        </form>
      </body>
    </html>
  `);
});

// Handle form submission
app.post("/submit", (req, res) => {
  const { name, email, phone } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to database:", err);
      res.send("Error connecting to database");
      return;
    }
    const sql = "INSERT INTO UserInfo (Name, Email, PhoneNo) VALUES (?, ?, ?)";
    connection.query(sql, [name, email, phone], (err, result) => {
      connection.release(); // Release the connection
      if (err) {
        console.error("Error executing query:", err);
        res.send("Error executing query");
        return;
      }
      console.log("Inserted successfully:", result);
      // res.send("Enquiry submitted successfully");
      res.redirect("http://127.0.0.1:5500/desinic-master/index.html");
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
