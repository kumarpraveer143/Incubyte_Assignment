import dotenv from "dotenv"
import app from "./app"

dotenv.config({ quiet: true })

// used injected envirnment variable port and listen to user request on that port
app.listen(process.env.PORT, () => {
    console.log(`server running in port ${process.env.PORT}`)
});