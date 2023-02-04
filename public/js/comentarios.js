
let titulo = document.getElementById('titulo').innerText

window.addEventListener('load', ()=>{
    fetch(`/comentariosLista/${titulo}`)
    .then(response => response.json())
    .then(data => {
        let contenido = "";
        data.comentarios[0].comentarios.forEach(element => {      

           contenido += `<p class='alert alert-info my-3'>${element}</p>`;
            
        });
        document.getElementById('resultado').innerHTML = contenido;

     })
     .catch(error => {
       console.error(error);
    });
 
  })