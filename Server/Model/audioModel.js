const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const audioSchema= new mongoose.Schema(
  {
    doctor: {
      type: String,
      required: [true,"Please provide doctor's name"],
    },
    patient: {
        type: String,
        required: [true,"Please provide patient's name"],
      },
    age: {
      type: Number,
      required: [true,"Please fill the age"],
    },
    date: {
      type: Date,
      required: [true,"Please fill the date"],
    },
    fileId:{
        type:ObjectId,
        required: [true,"Please fill the fileId"],
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Audio", audioSchema);