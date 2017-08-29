let mysql = require ("promise-mysql");
let conexion = null;

let accion = {
    insertar: tarea => consultar_datos(tarea),
    renombrar:null,
    completar:null,
    borrar:null,
    consultar:null,
    consultar_tarea:null,
    ayuda:null
}

function crear_conexion(){
    return mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"root",
        database:"to_do"
    }).then(function(conn){
        conexion = conn;
    });
}

function consultar_datos(tarea){
    let existe_tarea = false;
    return new Promise(function (resolve,reject){
        crear_conexion()
            .then(function(){
                conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
                    .then (function(datos){
                        for(let i in datos){
                            if(datos[i].nombre === tarea){
                                existe_tarea =true;
                                break;
                            }
                        }
                        if(existe_tarea === false){
                            conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${tarea}','pendiente',now())`);
                            return "Tarea ingresada ok";
                        }
                        else{
                            return "La tarea ya existe";
                        }
                    }).then (function(respuesta){
                        conexion.end();
                        resolve (respuesta);
                    });
            });
    });
}

module.exports = accion;