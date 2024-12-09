import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: {type: String , required: true},
});

const Admin = mongoose.model('Admin', userSchema);    //User -> name of the model and collection in dB in mongoDb

export default Admin;
