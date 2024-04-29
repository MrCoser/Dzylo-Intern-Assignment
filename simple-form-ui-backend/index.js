import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { body, validationResult } from "express-validator";
import db from "./database/db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json({ message: "This message comes from backend" });
});
const validateDetails = [
  // validate firstName field
  body("firstName")
    .isAlpha()
    .withMessage("First name must contain only alphabetic characters"),

  // validate lastName field
  body("lastName")
    .isAlpha()
    .withMessage("Last name must contain only alphabetic characters"),

  // validate email field
  body("email").isEmail().withMessage("Email address found invalid"),

  // validate lastName field
  body("phoneNumber")
    .isMobilePhone()
    .withMessage(
      "Phone number must be of 10 digits, along with the country code"
    ),

  // check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

app.get("/api/getData", (req, res) => {
  db.query("SELECT * FROM details", (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      res.status(500).json({ error: "Error occurred while fetching data" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/api/submitData", validateDetails, (req, res) => {
  // extract data from request body
  const { firstName, lastName, email, phoneNumber, address } = req.body;
  // insert data into MySQL database
  db.query(
    "INSERT INTO details (First_Name, Last_Name, Email, Phone_Number, Address) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, phoneNumber, address],
    (err) => {
      if (err) {
        console.error("Error inserting user: ", err);
        res.status(500).json({ error: "An error occured while registering" });
      } else {
        console.log("User signed up successfully");
        res.status(200).json({ message: "User registered successfully" });
      }
    }
  );
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Interval server error" });
  next();
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running successfully on Port: ${PORT}`);
});
