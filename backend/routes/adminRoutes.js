import express from "express";
import Admin from "../models/Admin.js";
import Category from "../models/Category.js";
import Employee from "../models/Employee.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";

const router = express.Router();

// sign up 
router.post('/signup', async (req, res) => {
  const { firstName, lastName, password, email } = req.body;

  try {
    console.log('Request received with data:', { firstName, lastName, email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Admin({
      firstName,
      lastName,
      password: hashedPassword,
      email,
    });

    console.log('New user object created:', newUser);

    // Save the new user
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Admin Login
router.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ loginStatus: false, Error: "Admin not found" });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ loginStatus: false, Error: "Incorrect password" });
    }

    // Generate JWT token and send in response
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, { httpOnly: true, secure: true });
    return res.json({ loginStatus: true });
  } catch (err) {
    return res.status(500).json({ loginStatus: false, Error: "Internal server error" });
  }
});


// Get Categories
router.get("/category", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ Status: true, Result: categories });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Add Category
router.post("/add_category", async (req, res) => {
    const { name } = req.body;
    try {
        const category = new Category({ name });
        await category.save();
        res.json({ Status: true });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// delete category 
router.delete("/delete_category/:id", async(req, res) => {

   try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ Status: true });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
})

// Image Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Public/Images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

// Add Employee
router.post("/add_employee", upload.single("image"), async (req, res) => {
    try {
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address,
        salary: req.body.salary,
        image: req.file ? req.file.filename : null,
        category_id: req.body.category_id,
        
    });    
    await employee.save();
   
    const populatedEmployee = await Employee.findById(employee._id).populate("category_id", "name");
   
    res.status(201).json({
        Status: true,
        Employee: populatedEmployee,
    });
} catch (err) {
    res.status(510).json({
        Status: false,
        Error: err.message,
    });
}
});

// Get Employees
router.get("/employee", async (req, res) => {
    try {
        const employees = await Employee.find().populate("category_id","name");
        res.json({ Status: true, Result: employees });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Get Employee by ID
router.get("/employee/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate("category_id","name");
        res.json({ Status: true, Result: employee });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// Edit Employee
router.put("/edit_employee/:id", async (req, res) => {
    try {
        // Extract the fields to update from the request body
        const updateData = {};

        if (req.body.name) updateData.name = req.body.name;
        if (req.body.email) updateData.email = req.body.email;
        if (req.body.salary) updateData.salary = req.body.salary;
        if (req.body.address) updateData.address = req.body.address;
        if (req.body.category_id) updateData.category_id = req.body.category_id;

        // Find and update the employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ Status: false, Error: "Employee not found" });
        }

        res.json({ Status: true, Result: updatedEmployee });
    } catch (err) {
        res.status(500).json({ Status: false, Error: err.message });
    }
});

// Delete Employee
router.delete("/delete_employee/:id", async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ Status: true });
    } catch (err) {
        res.json({ Status: false, Error: err.message });
    }
});

// admin count 
// Get Admin Count
router.get('/admin_count', async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        res.json({ Status: true, Result: { admin: adminCount } });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// Get Employee Count
router.get('/employee_count', async (req, res) => {
    try {
        const employeeCount = await Employee.countDocuments();
        res.json({ Status: true, Result: { employee: employeeCount } });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

router.get('/salary_count', async (req, res) => {
    try {
        const salarySum = await Employee.aggregate([
            {
                $group: {
                    _id: null, // No grouping key, so it calculates for all documents
                    salaryOFEmp: { $sum: "$salary" } // Summing the `salary` field
                }
            }
        ]);
        const totalSalary = salarySum.length > 0 ? salarySum[0].salaryOFEmp : 0;
        return res.json({ Status: true, Result: { salaryOFEmp: totalSalary } });
    } catch (err) {
        console.error("Error in salary_count API:", err); // Log the error
        return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});

// Get All Admin Records
router.get('/admin_records', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json({ Status: true, Result: admins });
    } catch (err) {
        res.json({ Status: false, Error: "Query Error: " + err.message });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({ Status: true })
});

export { router as adminRouter };
