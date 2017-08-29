let mysql = require ("promise-mysql");
let conexion = null;

let accion = {
    insertar: (dato_insertar) => consultar_datos(dato_insertar),
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

function consultar_datos(dato_insertar){
    let existe_tarea = false;
    if (dato_insertar === ""){
        return "La tarea no debe estar en blanco";
    }
    else{
        crear_conexion().
        then(function(){
            conexion.query("SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas")
                .then (function(datos){
                    for(let i in datos){
                        if(datos[i].nombre === dato_insertar){
                            existe_tarea =true;
                            break;
                        }
                    }
                }).
                then (function(){
                    conexion.close();
                });
        });
        return "La tarea ya existe";    
    }
}

module.exports = accion;