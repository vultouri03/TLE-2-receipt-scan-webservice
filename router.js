import express from "express";

const router = express.Router();

router.get("/", async(req, res) => {
    res.json("we are classefied")
})

router.post("/", async(req, res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let categories = {
        "dairy": 0,
        "meat": 0,
        "drinks": 0,
        "vegetables": 0,
        "wheats": 0,
        "spices": 0,
        "sauces": 0
    };

    const image = req.body.image;

    console.log(atob(image));

    categories.dairy += 10;

    res.json(categories)

})

export default router