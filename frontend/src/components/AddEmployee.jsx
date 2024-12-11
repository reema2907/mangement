// Frontend: AddEmployee Component
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    salary: "",
    address: "",
    category_id: "",
    image: "",
  });

  const [category, setCategory] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false); // To handle loading states
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category")
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        alert("Failed to load categories. Please try again later.");
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("username", employee.username);
    formData.append("password", employee.password);
    formData.append("address", employee.address);
    formData.append("salary", employee.salary);
    formData.append("image", employee.image);
    formData.append("category_id", employee.category_id);

    axios
      .post("http://localhost:5000/api/add_employee", formData)
      .then((result) => {
        if (result.data.Status) {
          // Send email after adding employee successfully
          axios
            .post("http://localhost:5000/api/send_email", {
              employeeusername: employee.username,
              employeeEmail: employee.email,
              employeePassword: employee.password,
            })
            .then((response) => {
              if (response.data.Status) {
                alert("Employee added and email sent successfully!");
                navigate("/dashboard/employee");
              } else {
                alert("Employee added, but failed to send email: " + response.data.Error);
              }
            })
            .catch((err) => console.error("Error sending email:", err));

          // Reset form
          setEmployee({
            name: "",
            email: "",
            username: "",
            password: "",
            salary: "",
            address: "",
            category_id: "",
            image: "",
          });
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error adding employee:", err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Name"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Enter Email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Username"
              value={employee.username}
              onChange={(e) => setEmployee({ ...employee, username: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-0"
              placeholder="Enter Password"
              value={employee.password}
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Salary</label>
            <input
              type="number"
              className="form-control rounded-0"
              placeholder="Enter Salary"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Address"
              value={employee.address}
              onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={employee.category_id}
              onChange={(e) => setEmployee({ ...employee, category_id: e.target.value })}
              disabled={loadingCategories || category.length === 0}
            >
              {loadingCategories ? (
                <option>Loading categories...</option>
              ) : category.length > 0 ? (
                <>
                  <option value="" disabled>
                    Select a category
                  </option>
                  {category.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </>
              ) : (
                <option>No categories available</option>
              )}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Select Image</label>
            <input
              type="file"
              className="form-control rounded-0"
              onChange={(e) => setEmployee({ ...employee, image: e.target.files[0] })}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "Add Employee and Send Credentials"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
