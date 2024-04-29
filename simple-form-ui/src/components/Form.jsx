import { useState, useEffect } from "react";
import axios from "axios";

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState([]);
  const [formData2, setformData2] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getData");
      setformData2(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError("Error occurred while fetching data");
    }
  };


  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression for basic phone number validation (10 digits)
    const pn = phoneNumber.slice(4);
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(pn);
  };

  /* const isValidPassword = (password) => {
    Note:- Regular expressions for password validation 
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const numberRegex = /[0-9]/;
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    return (
      password.length >= 8 &&
      symbolRegex.test(password) &&
      numberRegex.test(password) &&
      upperCaseRegex.test(password) &&
      lowerCaseRegex.test(password)
    );
  }; */

  /* const isValidAge = (age) => {
    return parseInt(age) >= 18 && parseInt(age) <= 100;
  }; */

  const validateForm = () => {
    let newErrors = {};
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!isValidPhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }
    errors.push(newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // console.log(errors);
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const isValid = validateForm();
      if (isValid) {
        console.log("Form Submitted", formData);
        const posting = await axios.post(
          "http://localhost:8000/api/submitData",
          formData
        );
        console.log(posting.data);
        await fetchData();
      } else {
        console.log("Form validation failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  /* const handleCheckboxChange = (e) => {
    const {name, checked} = e.target;
    let updatedInterests = [...formData.interests];
    if (checked) {
      updatedInterests.push(name);
    } else {
      updatedInterests = updatedInterests.filter(
        (interest) => interest !== name
      );
    }

    setFormData({
      ...formData,
      interests: updatedInterests,
    });
  }; */

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Sign-up Form</h1>
      <div className="center-align">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          placeholder="Enter your first name"
          onChange={handleChange}
        />
        {errors.firstName && <div className="error">{errors.firstName}</div>}
      </div>
      <div className="center-align">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          placeholder="Enter your last name"
          onChange={handleChange}
        />
        {errors.lastName && <div className="error">{errors.lastName}</div>}
      </div>
      <div className="center-align">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          placeholder="Enter your email"
          onChange={handleChange}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      <div className="center-align">
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          placeholder="Enter your phone number"
          onChange={handleChange}
        />
        {errors.phoneNumber && (
          <div className="error">{errors.phoneNumber}</div>
        )}
      </div>

      <div className="center-align">
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          placeholder="Enter your residential address"
          onChange={handleChange}
        />
        {errors.address && <div className="error">{errors.address}</div>}
      </div>
      <button type="submit" role="button">
        Submit
      </button>
      <div className="table-style">
        <h2>Form data received:</h2>
          {error ? (
            <p>{error}</p>
          ) : (
            <table className="center">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                </tr>
              </thead>
              <tbody>
                {formData2.map((submission, index) => (
                  <tr key={index}>
                    <td>{submission.First_Name}</td>
                    <td>{submission.Last_Name}</td>
                    <td>{submission.Email}</td>
                    <td>{submission.Phone_Number}</td>
                    <td>{submission.Address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </form>
  );
};


export default Form;
