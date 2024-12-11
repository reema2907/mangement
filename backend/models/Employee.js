import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: {type:String, required: true},
    password: { type: String, required: true },
    address: { type: String, required: true },
    salary: { type: Number, required: true },
    image: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

const Employee = mongoose.model("Employee", EmployeeSchema);
export default Employee;
