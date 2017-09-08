const express = require("express");
const app = express();
const cors = require("cors");
const accion = require("./accion.js");

app.use(cors());


app.get("/ayuda", (req, res) => {
    res.json(accion.ayuda());
});

app.get("/consultar", (req, res) => {
   accion.consultar().then(respuesta => res.json( respuesta ));
});

app.get("/completar_todo", (req, res) => {
    accion.completar_todo().then(respuesta => res.json(respuesta));
});

app.get("/pendiente_todo", (req, res) => {
    accion.pendiente_todo().then(respuesta => res.json(respuesta));
});

app.get("/borrar_completados", (req, res) => {
    accion.borrar_completados().then(respuesta => res.json(respuesta));
});



app.get("/insertar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.insertar(tar).then(respuesta => res.json(respuesta));
});

app.get("/completar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.completar(tar).then(respuesta => res.json(respuesta));
});

app.get("/borrar/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.borrar(tar).then(respuesta => res.json(respuesta));
});

app.get("/consultar_tarea/:tar", (req, res) => {
    let tar = req.params.tar;
    accion.consultar_tarea(tar).then(respuesta => res.json({ respuesta }));
});

app.get("/renombrar", (req, res) => {
    accion.renombrar(req.query.tarea, req.query.nueva).then(respuesta => res.json(respuesta));
});

app.get("/*", (req, res) => {
    res.json("esa tal ruta " + req.originalUrl + " no existe!!!");
});

app.listen(3000, () => console.log("Restarting ..."));