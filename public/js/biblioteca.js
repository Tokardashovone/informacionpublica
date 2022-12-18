window.addEventListener('load', ()=>{
let contenido = "";
fetch('/biblioteca')
  .then(response => response.json())
  .then(data => {
        console.log(data.titulos);
        data.titulos.forEach(element => {
            
            contenido += `<a href='/publicacion?nombre=${element.nombre}&titulo=${element.titulo}&categoria=${element.categoria}&link=${element.link}&creado=${element.creado}' class='alert alert-info my-3 d-block'>${element.titulo}</a>`;
        });
        document.getElementById('contenedor').innerHTML = contenido;

  });
});