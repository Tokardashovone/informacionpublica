let formulario_2 = document.forms[1];

formulario_2.addEventListener('submit', e =>{
    e.preventDefault();
    registrar()
  
 });

 function registrar(){
    const data = new FormData();
    
    data.append('direccion_publica', document.getElementById('direccion_publica').value );
 
    fetch('/registrar', {
       method: 'POST',
       body: data
    })
    .then(response => {
      response.json()
   })
    .then(data => {
      
      location.reload();
      //console.log(data);
      
   })
   .catch(error => {
      console.error(error);
   });
 }

 window.addEventListener('load', ()=>{
    fetch('/registros')
    .then(response => response.json())
    .then(data => {
       let contenido = "<table class = 'table-bordered table-dark'><thead><tr><th class= 'p-3'>Número lotería</th><th class='p-3'>Dirección pública</th><th class='p-3'>Validado</th></tr></thead><tbody>"
       let contador = 0;
       data.registros.forEach(element => {
            contenido += `<tr><td class = "p-3">${contador}</td><td class = "p-3">${element.direccion_publica}</td><td class = "p-3">${element.validado}</td></tr>`
            contador++;
       });  
       contenido += "</tbody></table>"
       document.getElementById('resultado2').innerHTML = contenido;
     })
     .catch(error => {
       console.error(error);
    });
 
  })