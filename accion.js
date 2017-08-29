let mysql = require ("promise-mysql");
let conexion = null;

let accion = {
    insertar: (accion,tarea) => consultar_datos(accion,tarea,null),
    renombrar:(accion,tarea,nueva_tarea) => consultar_datos(accion,tarea,nueva_tarea),
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

function consultar_datos(accion,tarea,nueva_tarea){
    return new Promise((resolve,reject) => {
        crear_conexion()
            .then(() => {
                conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
                    .then ((datos) => {
                        for(let i in datos){
                            if(datos[i].nombre === tarea){
                                switch (accion){
                                    case "insertar":
                                        return "La tarea ya existe";
                                    case "renombrar":
                                        return consultar_datos_renombrar(tarea,nueva_tarea)
                                        .then(resultado => resultado);
                                }
                            }
                        }
                        switch (accion){
                            case "insertar":
                                conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${tarea}','pendiente',now())`);
                                return "Tarea ingresada ok";
                            case "renombrar":
                                return "La tarea no existe";
                        }
                    }).then (respuesta => {
                        conexion.end();
                        resolve (respuesta);
                    });
            });
    });
}

function consultar_datos_renombrar(tarea,nueva_tarea){
    return new Promise ((resolve, reject) => {
        conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
        .then(function(datos){
            for(let i in datos){
                if (datos[i].nombre === nueva_tarea){
                    resolve ("La tarea ya existe");
                    return;
                }
            }
            conexion.query(`UPDATE to_do.tareas SET nombre = '${nueva_tarea}' WHERE nombre = '${tarea}'`);
            resolve ("Tarea renombrada ok");
        });
    });
}

module.exports = accion;