import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Employee from './components/Employee';
import Category from './components/Category';
import AddCategory from './components/AddCategory';
import SignUp from './components/signup.js';
import EditEmployee from './components/EditEmployee';
import AddEmployee from './components/AddEmployee.jsx';
import Payslip from './components/payslip.js';


function App() {
  return (
    <Router>
  <Routes>
    <Route path="/" element={<Navigate to="/adminlogin" />} /> {/* Redirect root to login */}
        <Route path="/adminlogin" element={<Login />} />
        
        
    <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />  {/* Default route for /dashboard */}
        <Route path="add_admin" element={<SignUp />} />
      <Route path="employee" element={<Employee />} />
      <Route path="category" element={<Category />} />
      <Route path="add_category" element={<AddCategory />} />
     <Route path="add_employee" element={<AddEmployee/>} />
      <Route path="edit_employee/:id" element={<EditEmployee />} />
     <Route path="payslip" element={<Payslip />} />
    </Route>
  </Routes>
</Router>
  );
}

export default App;
