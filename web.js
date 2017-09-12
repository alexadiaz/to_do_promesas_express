const express = require("express");
const app = express();
const cors = require("cors");
const accion = require("./accion.js");
var bodyparser = require("body-parser");

app.use(cors());
app.use(bodyparser.json());

app.get("/ayuda", (req, res) => {
    res.json(accion.ayuda());
});

app.get("/consultar", (req, res) => {
   accion.consultar().then(respuesta => res.json( respuesta ));
});

app.post("/completar_todo", (req, res) => {
    accion.completar_todo().then(respuesta => res.json(respuesta));
});

app.post("/pendiente_todo", (req, res) => {
    accion.pendiente_todo().then(respuesta => res.json(respuesta));
});

app.post("/borrar_completados", (req, res) => {
    accion.borrar_completados().then(respuesta => res.json(respuesta));
});

app.post("/insertar", (req, res) => {
    accion.insertar(req.body.tarea).then(respuesta => res.json(respuesta));
});

app.post("/completar", (req, res) => {
    accion.completar(req.body.tarea).then(respuesta => res.json(respuesta));
});

app.post("/borrar", (req, res) => {
    accion.borrar(req.body.tarea).then(respuesta => res.json(respuesta));
});

app.get("/consultar_tarea", (req, res) => {
    accion.consultar_tarea(req.query.tarea).then(respuesta => res.json(respuesta));
});

app.post("/renombrar", (req, res) => {
    accion.renombrar(req.body.tarea, req.body.nueva).then(respuesta => res.json(respuesta));
});

app.get("/*", (req, res) => {
    res.json("esa tal ruta " + req.originalUrl + " no existe!!!");
});

app.listen(3000, () => console.log("Restarting ..."));