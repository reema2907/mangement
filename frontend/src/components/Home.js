import axios from 'axios';
import React, { useState, useEffect } from 'react';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchData = async () => {
      try {
        await adminCount();
        await employeeCount();
        await salaryCount();
        await AdminRecords();
      } catch (err) {
        setError('Failed to fetch data');
        console.log(err);
      } finally {
        setLoading(false); // End loading once all data is fetched
      }
    };
    
    fetchData();
  }, []);

  const AdminRecords = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/admin_records');
      if (result.data.Status) {
        setAdmins(result.data.Result);
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.log('Error fetching admin records:', err);
    }
  };

  const adminCount = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/admin_count');
      if (result.data.Status) {
        setAdminTotal(result.data.Result[0].admin);
      }
    } catch (err) {
      console.log('Error fetching admin count:', err);
    }
  };

  const employeeCount = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/employee_count');
      if (result.data.Status) {
        setEmployeeTotal(result.data.Result[0].employee);
      }
    } catch (err) {
      console.log('Error fetching employee count:', err);
    }
  };

  const salaryCount = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/salary_count');
      if (result.data.Status) {
        setSalaryTotal(result.data.Result[0].salaryOFEmp);
      } else {
        alert(result.data.Error);
      }
    } catch (err) {
      console.log('Error fetching salary count:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Error message
  }

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Admin</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salary</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>${salaryTotal}</h5>
          </div>
        </div>
      </div>
      <div className='mt-4 px-5 pt-3'>
        <h3>List of Admins</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              admins.map(a => (
                <tr key={a.email}>
                  <td>{a.email}</td>
                  <td>
                    <button className="btn btn-info btn-sm me-2">
                      Edit
                    </button>
                    <button className="btn btn-warning btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;