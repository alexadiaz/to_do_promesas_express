const express = require("express");
const app = express();
const accion = require("./accion.js");

app.get("/", (req,res) => res.send ("Debe escribir una accion"));

app.get("/:ac", (req,res) => {
    let ac = req.params.ac;
    if (ac === "insertar"){
        res.send("Debe escribir tarea a insertar");
    }
});

app.get("/:ac/:tar", (req,res) => {
    let ac = req.params.ac;
    let tar = req.params.tar;
    if (ac === "insertar"){
        accion.insertar(tar)
        .then(function(respuesta){
            res.send (respuesta);
        });
    }
});

app.listen(3000);

//res.json({accion:accion});