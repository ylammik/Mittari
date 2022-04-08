// tehdään express app
// lataa nodejs omalle koneelle jos ei ole jo valmiina
// npm install express -- save
// npm install sqlite3 --save
// C:
// cd C:\Users\k1901836\OneDrive - Epedu O365\Lukuvuosi 21-22\Verkko-ohjelmointi\Mittari
// npm init
// kaikkiin enter ja vikaan yes
// node app.js
// postmanissa post komenossa täpät body, raw ja json!!
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser")
const { response } = require("express")
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

var HTTP_PORT = process.env.PORT || 8080
// käynnistetään serveri
app.listen(HTTP_PORT,() =>{
    console.log("Server running on %PORT%".replace("%PORT%", HTTP_PORT))
})

app.get("/",(req, res, next)=>{
    res.json({"message":"OK"})
})

// komento jolla haetaan tiedot get
app.get("/api/measurements/", (req, res, next) =>{
    var select = "SELECT * FROM mittaus;"

    db.all(select, (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message})
            return
        }
        res.json({
            "message":"succes",
            "data":rows
        })
    })
})

// komento jolla lisätään tietoa
app.post("/api/measurements/", (req, res, next) =>{
    
    var errors =[]
    if(!req.body.numero){
        errors.push("Numeroa ei määritetty")
    }
    if(errors.length){
        res.status(400).json({"error": errors.join(",")})
        return
    }

    var data = {
        numero: req.body.numero
    }

    var insert = "INSERT INTO mittaus(numero, aika) VALUES (?,DATETIME(CURRENT_TIMESTAMP,\'localtime\'));" // sama kuin database tiedostossa
    var param = [data.numero]
    db.run(insert, param, function(err, result){
        if(err){
            res.status(400).json({"error":err.message})
            console.log("sql error: %ERR%".replace("%ERR%", err.message))
            return
        }
        res.json({
            "message":"success",
            "data":data,
            "id":this.lastID
        })
    })

})

// oletusvasaus jos pyynnölle ei ole käsittelyä
/*app.use(function(req, res){
    res.status(404);

})*/