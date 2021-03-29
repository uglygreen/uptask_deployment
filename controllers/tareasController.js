const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/tareas');

exports.agregarTarea = async (req, res) =>{
    //obtenemo proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    //leer valor del inpt
    const {tarea} = req.body;
    // estado 0 = incompleto y ID de proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if(!resultado){
        return next();
    }

    res.redirect(`/proyectos/${req.params.url}`);
}


exports.cambiarEstadoTarea = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }});
    
    //cambiar estado
    let estado = 0;
    if(tarea.estado === estado){
        estado = 1
    }
    tarea.estado = estado;

    const resultado = await tarea.save();
    if(!resultado) return next();
    
    res.status(200).send('Actualizado');
}

exports.eliminarTarea = async (req, res) => {
    const { id } =  req.params;

    //eliminar tarea
    const resultado = await Tareas.destroy({where : { id }});

    if(!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}