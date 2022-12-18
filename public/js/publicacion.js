window.addEventListener('load', ()=>{
    let contenido = "";
    fetch('/publicacion')
      .then(response => response.json())
      .then(data => {
            console.log(data);
          
      });
    });