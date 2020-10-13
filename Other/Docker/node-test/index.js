import express from 'express';

const PORT = process.env.PORT || 4000;
const app = express();


// home
app.get("/", (req, res) => {
  res.send("Hello ______ ");
});


// port
app.listen(PORT, () => {
  console.log("Listening on Port " + PORT);
});
