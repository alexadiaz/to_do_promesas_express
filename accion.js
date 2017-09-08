let mysql = require ("promise-mysql");
let conexion = null;

let accion = {
    insertar: (tarea) => insertar(tarea),
    renombrar:(tarea,nueva_tarea) => renombrar(tarea,nueva_tarea),
    completar:(tarea) => completar(tarea),
    borrar:(tarea) => borrar(tarea),
    consultar: () => consultar(),
    consultar_tarea: tarea => consultar_tarea(tarea),
    completar_todo: () => completar_todo(),
    pendiente_todo: () => pendiente_todo(),
    borrar_completados: () => borrar_completados(),
    ayuda:() =>  {
        let menu = [
            "Insertar tareas",
            "Renombrar tareas",
            "Completar una tarea",
            "Borrar una tarea",
            "Consultar todas las tareas",
            "Consultar una tarea",
            "Completar todas las tareas",
            "Poner en pendiente todas las tareas",
            "Borrar todas las tareas terminadas"
        ];
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

function insertar(tarea){
    return new Promise(resolve => {
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then (existe => {
                if(existe === true){
                    return "La tarea ya existe";
                }
                return conexion.query(`INSERT INTO to_do.tareas (nombre,estado,creacion) VALUES ('${tarea}','pendiente',now())`)
                    .then(()  => {
                        return "Tarea ingresada ok";
                    });
                
            }).then(resultado => {
                conexion.end();
                resolve (resultado);
            });
        });
    });
}

function renombrar(tarea,nueva_tarea){
    return new Promise (resolve => {
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then(existe => {
                if (existe === true){
                    return verificar_tarea_existe(nueva_tarea)
                    .then (guardada => {
                        if (guardada === true){
                            return "La tarea ya existe";
                        }
                        else{
                            return conexion.query(`UPDATE to_do.tareas SET nombre = '${nueva_tarea}' WHERE nombre = '${tarea}'`)
                            .then(() => {
                                return "Tarea renombrada ok";
                            });
                        }
                    });
                }
                return "La tarea no existe";
            }).then(resultado => {
                conexion.end();
                resolve (resultado);
            });
        });
    });
}

function completar(tarea){
    return new Promise(resolve => {
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then(existe => {
                if (existe === true){
                    return completar_tarea(tarea)
                    .then(consulta => consulta);
                }
                return "La tarea no existe";
            }).then(resultado => {
                conexion.end();
                resolve (resultado);
            });
        });
    });
}

function completar_tarea(tarea){
    return new Promise(resolve =>{
        conexion.query(`SELECT tareas.estado FROM to_do.tareas where nombre = '${tarea}'`)
        .then(datos => {
            if (datos[0].estado === "terminado"){
                return conexion.query(`UPDATE to_do.tareas SET estado = 'pendiente', finalizacion = null WHERE nombre = '${tarea}'`)
                .then(() => {
                    return "Tarea pendiente ok";
                });
            }
            else{
                return conexion.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${tarea}'`)
                .then(() => {
                    return "Tarea completada ok";
                });
            }
        }).then(respuesta => resolve (respuesta));
    });
}

function borrar(tarea){
    return new Promise(resolve =>{
        crear_conexion()
        .then(() => {
            verificar_tarea_existe(tarea)
            .then (existe => {
                if(existe === true){
                    return conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${tarea}'`)
                    .then(() => {
                        return "Tarea borrada ok";
                    });
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
            conexion.query("select idtareas,nombre,estado,creacion,finalizacion from to_do.tareas") 
            .then(consulta =>{
                conexion.end();
                resolve (consulta);
            });
        });
    });
}

function consultar_tarea(tarea){
    return new Promise(function(resolve){
        crear_conexion()
        .then (() =>{
            conexion.query(`SELECT idtareas,nombre,estado,creacion,finalizacion FROM to_do.tareas WHERE tareas.nombre like '%${tarea}%'`)
            .then ((datos) =>{
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

function completar_todo(){
    return new Promise(resolve =>{
        consultar()
        .then(tareas =>{
            crear_conexion()
            .then(() =>{
                let promesas = [];
                for (let i in tareas){
                    if(tareas[i].estado === "pendiente"){
                        promesas.push (conexion.query(`UPDATE to_do.tareas SET estado = 'terminado', finalizacion = now() WHERE nombre = '${tareas[i].nombre}'`));
                    }
                }
                return Promise.all(promesas);
            }).then(() =>{
                conexion.end();
                resolve ("Tareas completadas ok");
            });
        });
    });
}

function pendiente_todo(){
    return new Promise(resolve =>{
        consultar()
        .then(tareas =>{
            crear_conexion()
            .then(() =>{
                let promesas =[];
                for (let i in tareas){
                    if(tareas[i].estado === "terminado"){
                        promesas.push (conexion.query(`UPDATE to_do.tareas SET estado = 'pendiente', finalizacion = null WHERE nombre = '${tareas[i].nombre}'`));
                    }
                }
                return Promise.all(promesas);
            }).then(() =>{
                conexion.end();
                resolve ("Tareas pendientes ok");
            });
        });
    });
}

function borrar_completados(){
    return new Promise(resolve =>{
        consultar()
        .then(tareas =>{
            crear_conexion()
            .then(() =>{
                let promesas =[];
                for (let i in tareas){
                    if(tareas[i].estado === "terminado"){
                         promesas.push (conexion.query(`DELETE FROM to_do.tareas WHERE nombre = '${tareas[i].nombre}'`));
                    }
                }
                return Promise.all(promesas);
            }).then(() =>{
                conexion.end();
                resolve ("Tareas borradas ok");
            });
        });
    });
}

module.exports = accion;