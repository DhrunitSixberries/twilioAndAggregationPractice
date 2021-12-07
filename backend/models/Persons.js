import mongoose from "mongoose";

const personSchema = mongoose.Schema({
  gender: String,
  name: Object,
  location: Object,
  login: Object,
  dob: Object,
  registered: Object,
  phone: String,
  cell: String,
  id: Object,
  picture: Object,
  nat: String,
});

const Perons = mongoose.model("Persons", personSchema);

export default Perons;
