const express = require("express");
const app = express();
const cors = require("cors");
const accion = require("./accion.js");
var bodyparser = require("body-parser");

app.use(cors());
app.use(bodyparser.json());

app.GET("/ayuda", (req, res) => {
    res.json(accion.ayuda());
});

app.GET("/consultar", (req, res) => {
   accion.consultar().then(respuesta => res.json( respuesta ));
});

app.POST("/completar_todo", (req, res) => {
    accion.completar_todo().then(respuesta => res.json(respuesta));
});

app.POST("/pendiente_todo", (req, res) => {
    accion.pendiente_todo().then(respuesta => res.json(respuesta));
});

app.POST("/borrar_completados", (req, res) => {
    accion.borrar_completados().then(respuesta => res.json(respuesta));
});

app.POST("/insertar", (req, res) => {
    accion.insertar(req.body.tarea).then(respuesta => res.json(respuesta));
});

app.POST("/completar", (req, res) => {
    accion.completar(req.body.tarea).then(respuesta => res.json(respuesta));
});

app.POST("/borrar", (req, res) => {
    accion.borrar(req.body.tarea).then(respuesta => res.json(respuesta));
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