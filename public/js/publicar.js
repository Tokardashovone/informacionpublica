
let formulario = document.forms['formulario'];
let titulo = formulario['titulo'];
let categoria = formulario['categoria'];
let descripcion = formulario['descripcion'];



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

      if (data.path == undefined ){

         document.getElementById('resultado').innerHTML = `El archivo no se ha subido porque debe ser de tipo texto. Se admiten los formatos .doc, .docx, .odt, .rtf y .txt`;

      }else{

         document.getElementById('resultado').innerHTML = `El archivo ${data.path} se ha subido correctamente.`;
      }
   
   
   })
   .catch(error => {
      console.error(error);
   });

   data.append('nombre', nombre.value);
   data.append('titulo', titulo.value);
   data.append('categoria', categoria.value);
   data.append('descripcion', descripcion.value);

   fetch('/titulo',{
      method: 'POST',
      body: data
   })
   .then(response => console.log(response))
   .catch(error => {
      console.log(error);
   });

}
