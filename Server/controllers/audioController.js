const mongoose = require("mongoose");
const multer = require("multer");
const { Readable } = require("stream");
const mongodb = require("mongodb");

const Audio = require("../Model/audioModel");

let db;
const URI =
  "mongodb+srv://priyansh:Priyansh123@healthka.dhmfios.mongodb.net/audiofile?retryWrites=true&w=majority&appName=Healthka";

/*Database Connection*/
const connectDB = async () => {
  try {
    await mongoose.connect(URI).then((database) => {
      db = database.connection.db;
      console.log("MongoDB is Running Successfully");
    });
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
};
connectDB();

/*To Get All Records/ Details of the Patients */
exports.getAudioDetails = async (req, res) => {
  try {
    const audioDetails = await Audio.find({});
    // console.log(audioDetails);
    return res.json(audioDetails);
  } catch (err) {
    console.log(err);
  }
};
/******To Get the Audio File of The Patients using Id******/
exports.getAudios = async (req, res) => {
  try {
    var trackID = new mongoose.Types.ObjectId(req.params.id);
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Invalid trackID in URL parameter." });
  }
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: "audios",
  });

  let downloadStream = bucket.openDownloadStream(trackID);

  downloadStream.on("data", (chunk) => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
};

/*Posting/Uploading Audio File using Multer + GridFs (If data Size is larger > 16MB) */
exports.postAudio = async (req, res) => {
  console.log("hello world");

  //  console.log(req.files);
  // const {doctor,patient,age,date}=req.body;
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  upload.single("audio")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    // console.log(req.body);
    //   console.log(req.file);
    const { doctor, patient, age, date } = req.body;
    let trackName = patient + "@" + new Date();

    //Converting buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: "audios",
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({ message: "Error uploading file" });
    });

    uploadStream.on("finish", async () => {
      /*Saving the Details alongwith audio file Id*/
      const audioModel = new Audio({
        doctor: doctor,
        patient: patient,
        age: Number(age),
        date: date,
        fileId: id,
      });
      await audioModel.save();
      return res
        .status(201)
        .json({
          message:
            "File uploaded successfully, stored under MongoDB with ObjectID: " +
            id,
        });
    });
  });
};
