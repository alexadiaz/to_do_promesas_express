const express = require("express");
const app = express();
const accion = require("./accion.js");

app.get("/", (req,res) => res.send ("Debe escribir una accion"));

app.get("/:ac", (req,res) => {
    let ac = req.params.ac;
    switch (ac){
        case "insertar": 
        case "completar": 
        case "borrar": 
            res.send("Debe escribir tarea");
        break;
        case "renombrar":
            res.send("Debe escribir tarea y nuevo nombre de tarea");
        break;
    }
});

app.get("/:ac/:tar", (req,res) => {
    let ac = req.params.ac;
    let tar = req.params.tar;
    switch (ac){
        case "insertar":
            accion.insertar(ac,tar)
            .then((respuesta) => res.send (respuesta));
        break;
        case "renombrar":
            res.send("Debe escribir nuevo nombre de tarea");
        break;
        case "completar":
            accion.completar(ac,tar)
            .then(respuesta => res.send(respuesta));
        break;
        case "borrar":
            accion.borrar(ac,tar)
            .then (respuesta => res.send(respuesta));
        break;
    }
});

app.get("/:ac/:tar/:ntar",(req, res) => {
    let ac = req.params.ac;
    let tar = req.params.tar;
    let ntar = req.params.ntar;
    switch (ac){
        case "renombrar":
            accion.renombrar(ac,tar,ntar)
            .then(respuesta => res.send(respuesta));
        break;
    }
});

app.listen(3000);

//res.json({accion:accion});