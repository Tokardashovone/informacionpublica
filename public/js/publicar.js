
let formulario = document.forms['formulario'];
let titulo = formulario['titulo'];
let categoria = formulario['categoria'];



formulario.addEventListener('submit', e =>{
   e.preventDefault();
   subirArchivo(e);
 
});




const subirArchivo = e => {
   const archivo = document.forms['formulario']['archivo'];
   const data = new FormData();
   
   data.append('archivo', archivo.files[0]);

   fetch('/subir-archivo', {
      method: 'POST',
      body: data
   })
   .then(response => response.json())
   .then(data => {
      document.getElementById('resultado').innerHTML = `El archivo ${data.path} se ha subido correctamente.`;
      console.log(data);
   })
   .catch(error => {
      console.error(error);
   });

   data.append('nombre', nombre.value);
   data.append('titulo', titulo.value);
   data.append('categoria', categoria.value);

   fetch('/titulo',{
      method: 'POST',
      body: data
   })
   .then(response => console.log(response))
   .catch(error => {
      console.log(error);
   });

}
