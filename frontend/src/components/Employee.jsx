import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link} from "react-router-dom";

const Employee = () => {
  const [employee, setEmployee] = useState([]);


  useEffect(() => {
    axios
      .get("http://localhost:5000/api/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    console.log("Deleting employee with id:", id); // Debugging
    axios
        .delete(`http://localhost:5000/api/delete_employee/${id}`)
        .then((result) => {
            if (result.data.Status) {
                // Filter out deleted employee from the list without reloading
                setEmployee(employee.filter((employee) => employee._id !== id));
            } else {
                alert(result.data.Error);
            }
        })
        .catch((err) => console.error("Error deleting employee:", err));
};


  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center">
        <h3>Employee List</h3>
      </div>
      <Link to="/dashboard/add_employee" className="btn btn-success">
        Add Employee
      </Link>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
    
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
               <th>Category</th>
              <th>Action</th>
             
            </tr>
          </thead>
          <tbody>
            {employee.map((e) => (
              <tr>
                <td>{e.name}</td>
               
                <td>{e.email}</td>
                <td>{e.address}</td>
                <td>{e.salary}</td>
                <td>{e.category_id.name}</td>
                <td>
                  <Link
                    to={`/dashboard/edit_employee/` + e._id}
                    className="btn btn-info btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleDelete(e._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employee;
