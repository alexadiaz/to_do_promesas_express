const express = require("express");
const app = express();
const accion = require("./accion.js");

app.get("/", (req, res) => res.send("Debe escribir una accion"));

app.get("/:ac", (req, res) => {
    let ac = req.params.ac;
    switch (ac) {
        case "insertar":
        case "completar":
        case "borrar":
            res.json("Debe escribir tarea");
            break;
        case "renombrar":
            res.json("Debe escribir tarea y nuevo nombre de tarea");
            break;
        case "consultar":
            accion.consultar().then(respuesta => res.json({ respuesta }));
            break;
        case "consultar_tarea":
            res.json("Debe escribir tarea o letras contenidas en ella");
            break;
        case "ayuda":
            res.json(accion.ayuda());
            break;
        default:
            res.json("La accion no es valida");
    }
});

app.get("/:ac/:tar", (req, res) => {
    let ac = req.params.ac;
    let tar = req.params.tar;
    switch (ac) {
        case "insertar":
            accion.insertar(tar).then(respuesta => res.json(respuesta));
            break;
        case "renombrar":
            res.json("Debe escribir nuevo nombre de tarea");
            break;
        case "completar":
            accion.completar(tar).then(respuesta => res.json(respuesta));
            break;
        case "borrar":
            accion.borrar(tar).then(respuesta => res.json(respuesta));
            break;
        case "consultar_tarea":
            accion
                .consultar_tarea(tar).then(respuesta => res.json({ respuesta }));
            break;
    }
});

app.get("/:ac/:tar/:ntar", (req, res) => {
    let ac = req.params.ac;
    let tar = req.params.tar;
    let ntar = req.params.ntar;
    switch (ac) {
        case "renombrar":
            accion
                .renombrar(ac, tar, ntar).then(respuesta => res.json(respuesta));
            break;
    }
});

app.listen(3000);
