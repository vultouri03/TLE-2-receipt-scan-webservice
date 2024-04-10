import express from "express"
import router from "./router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use("/classify", router)

app.listen("8000")

