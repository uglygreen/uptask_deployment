import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e =>{
        const urlProyecto = e.target.dataset.proyectoUrl;
        //console.log(urlProyecto);
        
        Swal.fire({
            title: 'Deseas borrar este proyecto?',
            text: "El proyecto no se podra recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'No, Cancelar'
          }).then((result) => {
            if (result.value) {
                //enviar petision a axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: {urlProyecto}}).then(function(respuesta){
                        console.log(respuesta);

                            Swal.fire(
                                'Eliminado!',
                                respuesta.data,
                                'success'
                            );
                            setTimeout(() =>{
                                window.location.href = '/'
                            }, 3000);
                    })
                    .catch(()=> {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el Proyecto'
                        })
                    })
             
    
                    
            }
          })
    });
}
export default btnEliminar;