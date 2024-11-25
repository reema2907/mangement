import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },

});

const Admin = mongoose.model('Admin', userSchema);    //User -> name of the model and collection in dB in mongoDb

export default Admin;
