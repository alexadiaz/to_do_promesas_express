const express = require("express");
const app = express();
const accion = require("./accion.js");

app.get("/:di", (req,res) => {
    let dato_insertar = req.params.di;
    
    let mostrar  = accion.insertar(dato_insertar);

    res.send(mostrar);
    //res.json({accion:accion});
});

app.listen(3000);