const express = require("express");
const audioRoutes = require("./Routes/audioRoutes");
const cors=require("cors");


const app = express();
app.use(cors())
app.use("/tracks", audioRoutes);

app.listen(5000, async () => {
  console.log("App listening on port 5000!");
});
