import React, { useState, useEffect } from "react";
import axios from "axios";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import "./payslip.css";

const PayslipPDF = ({ employee, month, basicSalary, bonus, deductions, leaves, category, phoneNo, email }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 12,
      backgroundColor: "#fff",
    },
    header: {
      fontSize: 20,
      marginBottom: 20,
    },
    section: {
      marginBottom: 10,
    },
    detail: {
      marginBottom: 5,
    },
  });

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View style={styles.header}>
          <Text>Payslip for {employee?.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.detail}>Month: {month}</Text>
          <Text style={styles.detail}>Basic Salary: {basicSalary}</Text>
          <Text style={styles.detail}>Bonus: {bonus}</Text>
          <Text style={styles.detail}>Deductions: {deductions}</Text>
          <Text style={styles.detail}>Leaves: {leaves}</Text>
          <Text style={styles.detail}>Category: {category}</Text>
          <Text style={styles.detail}>Phone No: {phoneNo}</Text>
          <Text style={styles.detail}>Email: {email}</Text>
        </View>
      </Page>
    </Document>
  );
};

const Payslip = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [month, setMonth] = useState("");
  const [bonus, setBonus] = useState('');
  const [deductions, setDeductions] = useState('');
  const [leaves, setLeaves] = useState('');
  const [phoneNo, setPhoneNo] = useState("");
  const [loading, setLoading] = useState(true);



  // Fetch all employees for the dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/employee");
        if (response.data.Status) {
          setEmployees(response.data.Result || []);
        } else {
          alert(response.data.Error);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployees([]); // Fallback to an empty array
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch employee details by ID
  const fetchEmployeeById = async (id) => {
    if (!id) {
      alert("Please select an employee.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/employee/${id}`);
      const data = response.data.Result;
      setEmployee({
        _id: data._id,
        name: data.name,
        email: data.email,
        salary: data.salary,
        category_id: data.category_id,
      });
      setPhoneNo(data.phone || ""); // Handle missing phone number
    } catch (error) {
      console.error("Error fetching employee details:", error);
      alert("Failed to fetch employee details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle employee selection
  const handleEmployeeSelect = (e) => {
    const id = e.target.value;
    setSelectedEmployeeId(id);
    if (id) fetchEmployeeById(id);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee) {
      alert("Please select an employee!");
      return;
    }
    alert("Payslip details ready for printing or download.");
  };

  return (
    <div className="app">
      <h1>Generate Payslip</h1>
      <div className="col-12">
        <label className="form-label">Select Employee</label>
        <select
          className="form-select"
          value={selectedEmployeeId}
          onChange={handleEmployeeSelect}
        >
          <option value="">Select an Employee</option>
          {Array.isArray(employees) &&
            employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} 
              </option>
            ))}
        </select>
      </div>

      {employee && (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Employee Name" value={employee.name} readOnly />
          <input
            type="text"
            placeholder="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
          <input type="number" placeholder="Basic Salary" value={employee.salary} readOnly />
          <input
            type="text"
            placeholder="Bonus"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Deductions"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Number of Leaves"
            value={leaves}
            onChange={(e) => setLeaves(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Phone No"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
            required
          />
          <input type="email" placeholder="Email" value={employee.email} readOnly />
          
        </form>
      )}

      {employee && (
        <div>
          <PDFDownloadLink
            document={
              <PayslipPDF
                employee={employee}
                month={month}
                basicSalary={employee.salary}
                bonus={bonus}
                deductions={deductions}
                leaves={leaves}
                category={employee.category_id?.name || "No Category"}
                phoneNo={phoneNo}
                email={employee.email}
              />
            }
            fileName="payslip.pdf"
          >
            {({ loading }) =>
              loading ? <button>Loading document...</button> : <button>Download Payslip</button>
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default Payslip;
