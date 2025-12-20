const express = require("express")
const cors = require("cors")

const gameRoutes = require("./routes/game")

const app = express()
app.use(cors())
app.use(express.json())

app.use("/api/game", gameRoutes)

app.listen(3001, () =>{
  console.log('Backend running on http://localhost:3001');
  
})