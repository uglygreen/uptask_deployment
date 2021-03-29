const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/tareas');

exports.proyectosHome = async(req, res) => {

    //console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where : { usuarioId }});
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where : { usuarioId }});
    res.render('nuevoProyecto',{
        nombrePagina : 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    // enviar a la consola lo que el usuario escriba

    //console.log(req.body);
    //validar que tengamos algo e el input
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where : { usuarioId }});
    const { nombre } = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto' : 'Agrega un nombre al proyecto'});
    }

    //si hay errores
    if(errores.length > 0){
       res.render('nuevoProyecto', {
           nombrePagina : 'Nuevo Proyecto',
           errores,
           proyectos
       })
    }else{
        //si no hay errores
        //insertar en la BD
        const usuarioId = res.locals.usuario.id;
         await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res ) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where : { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //Consultar tareas del pryecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }
    });



    if(!proyecto) return next();

    //render
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where : { usuarioId }});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);



    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}
exports.actualizarProyecto = async(req, res) => {
    // enviar a la consola lo que el usuario escriba

    //console.log(req.body);
    //validar que tengamos algo e el input
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where : { usuarioId }});
    const { nombre } = req.body;
    let errores = [];
    if(!nombre){
        errores.push({'texto' : 'Agrega un nombre al proyecto'});
    }

    //si hay errores
    if(errores.length > 0){
       res.render('nuevoProyecto', {
           nombrePagina : 'Nuevo Proyecto',
           errores,
           proyectos
       })
    }else{
        //si no hay errores
       
         await Proyectos.update(
             { nombre: nombre },
             { where: { id: req.params.id }}
             
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
   // console.log(req.query);
   const {url} = req.params;

   const resultado = await Proyectos.destroy({where: {url}});
    if(!resultado){
        return next();
    }
   res.status(200).send('Proyecto Eliminado Correctamente');
}