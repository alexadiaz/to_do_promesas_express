const express = require("express");
const app = express();
const cors = require("cors");
const accion = require("./accion.js");

app.use(cors());

app.get("/", (req, res) => res.send("Debe escribir una accion"));

app.get("/:consultar", (req, res) => {
   accion.consultar().then(respuesta => res.json( respuesta ));
});

app.get("/:completar_todo", (req, res) => {
    accion.completar_todo().then(respuesta => res.json(respuesta));
});

app.get("/:pendiente_todo", (req, res) => {
    accion.pendiente_todo().then(respuesta => res.json(respuesta));
});

app.get("/:borrar_completados", (req, res) => {
    accion.borrar_completados().then(respuesta => res.json(respuesta));
});

app.get("/:ayuda", (req, res) => {
    res.json(accion.ayuda());
});

app.get("/:insertar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.insertar(tar).then(respuesta => res.json(respuesta));
});

app.get("/:completar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.completar(tar).then(respuesta => res.json(respuesta));
});

app.get("/:borrar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.borrar(tar).then(respuesta => res.json(respuesta));
});

app.get("/:consultar_tarea/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.consultar_tarea(tar).then(respuesta => res.json({ respuesta }));
});

app.get("/:renombrar/:tar/:ntar", (req, res) => {
    let tar = req.params.tar;
    let ntar = req.params.ntar;
    accion.renombrar(tar, ntar).then(respuesta => res.json(respuesta));
});

app.listen(3000);
