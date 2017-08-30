let mysql = require ("promise-mysql");
let conexion = null;

let accion = {
    insertar: (accion,tarea) => verificar_tarea_existe(accion,tarea,null),
    renombrar:(accion,tarea,nueva_tarea) => verificar_tarea_existe(accion,tarea,nueva_tarea),
    completar:(accion,tarea) => verificar_tarea_existe(accion,tarea,null),
    
    borrar:(tarea) => borrar(tarea),
    consultar: () => consultar(),
    consultar_tarea: tarea => consultar_tarea(tarea),
    ayuda:() =>  {
        let menu = {
            insertar: "Insertar una tarea",
            renombrar: "Renombrar una tarea",
            completar: "Completar una tarea",
            borrar: "Borrar una tarea",
            consultar: "Consultar todas las tareas",
            consultar_tarea: "Consultar por tarea"
        };
        return menu;
    }
};

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

function verificar_tarea_existe(accion,tarea,nueva_tarea){
    return new Promise((resolve) => {
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
                            case "completar":
                                return completar(tarea)
                                .then(resultado => resultado);
                            case "borrar":
                                conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${tarea}'`);
                                return "Tarea borrada ok";
                        }
                    }
                }
                switch (accion){
                    case "insertar":
                        conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${tarea}','pendiente',now())`);
                        return "Tarea ingresada ok";
                    case "renombrar":
                    case "completar":
                    case "borrar":
                        return "La tarea no existe";
                }
            }).then (respuesta => {
                conexion.end();
                resolve (respuesta);
            });
        });
    });
}

function verificar_tarea_existe(tarea){
    return new Promise((resolve) => {
        conexion.query(`SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas where tareas.nombre = '${tarea}'`)
        .then(consulta => {
            if (consulta.length === 0){
                resolve (false);
                return;
            }
            resolve (true);
        });
    });
}

function consultar_datos_renombrar(tarea,nueva_tarea){
    return new Promise ((resolve) => {
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

function borrar(tarea){
    return new Promise(resolve =>{
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then (existe => {
                if(existe === true){
                    conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${tarea}'`);
                    return "Tarea borrada ok";
                }
                return "La tarea no existe";
            }).then(resultado =>{
                conexion.end();
                resolve (resultado);
            });
        });
    }); 
}

function completar(tarea){
    return new Promise(function(resolve){
        conexion.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${tarea}'`)
        .then(function(datos){
            if (datos[0].estado === "terminado"){
                resolve ("La tarea ya estaba terminada");
                return;
            }
            else{
                conexion.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${tarea}'`);
                resolve ("Tarea completada ok");
            }
        });
    });
}

function borrar(tarea){
    return new Promise(resolve =>{
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then (existe => {
                if(existe === true){
                    conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${tarea}'`);
                    return "Tarea borrada ok";
                }
                return "La tarea no existe";
            }).then(resultado =>{
                conexion.end();
                resolve (resultado);
            });
        });
    }); 
}

function consultar(){
    return new Promise ((resolve) => {
        crear_conexion()
        .then(() => {
            let consulta = conexion.query("select idtareas,nombre,estado,creacion,finalizacion from to_do.tareas");
                conexion.end();
                resolve (consulta);
            });
        });
}

function consultar_tarea(tarea){
    return new Promise(function(resolve){
        crear_conexion()
        .then (() =>{
            conexion.query(`SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas WHERE tareas.nombre like '%${tarea}%'`)
            .then (function(datos){
                if(datos.length === 0){
                    return "No se encontraron coincidencias";
                }
                return datos;
            }).then (consulta => {
                conexion.end();
                resolve (consulta);
            });
        });
    });
}

module.exports = accion;