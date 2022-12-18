let formulario = document.forms['formulario'];

formulario.addEventListener('submit', e => {
    e.preventDefault();
    subirSugerencia(e);
 });


const subirSugerencia = e => {

    const data = new FormData();
    
    data.append('sugerencia', document.getElementById('sugerencia').value );
 
    fetch('/sugerencias', {
       method: 'POST',
       body: data
    })
    .then(response => {
      response.json()
   })
    .then(data => {
      
      console.log(data);
      location.reload();
      
   })
   .catch(error => {
      console.error(error);
   });
   
 }

 window.addEventListener('load', ()=>{
   console.log('carga el documento');
   fetch('/sugerenciasLista')
   .then(response => response.json())
   .then(data => {
      console.log(data);
      let contenido = "";
      data.sugerencias.forEach(element => {

         if (element.respuesta !== undefined){

            contenido += `<div class='alert alert-info my-3'><p>${element.sugerencia}</p><p class='alert alert-danger my-1'>Respuesta: ${element.respuesta}</p></div>`;
         }


         contenido += `<p class='alert alert-info my-3'>${element.sugerencia}</p>`;
          
      });
      document.getElementById('resultado').innerHTML = contenido;
    })
    .catch(error => {
      console.error(error);
   });

 })