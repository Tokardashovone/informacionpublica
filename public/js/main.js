$(function () {
    const socket = io();
  
    // variables del dom
  
    let $FormularioRegistro = $("#FormularioRegistro");
    let $RegistroNombre = $("#RegistroNombre");
    let $CajaChatsAbiertos = $("#CajaChatsAbiertos");
    let $CajaMensajesGeneral = $("#CajaMensajesGeneral");
    let $FormularioMensaje = $("#FormularioMensaje");
    let $TextoMensaje = $("#TextoMensaje");
    let $CajaUsuariosConectados = $("#CajaUsuariosConectados");
  
    // Otras variables necesarias
  
    let arrayUsuarios = [];
    let miUsuario = {};
    let dequien = {
      id: "",
      nombre: "",
      room: "",
    };
  
    let aquien = {
      id: "",
      nombre: "",
      room: "",
    };
  
    let usuariosSet = new Set();
  
    // Funciones helper
    function usuariosConectados(array) {
      $CajaUsuariosConectados.empty();
      usuariosSet.clear();
      array.forEach((usuario) => {
        usuariosSet.add(usuario);
      });
  
      usuariosSet.forEach((usuario) => {
        if (usuario.nombre !== miUsuario.nombre) {
          $CajaUsuariosConectados.append(
            `<p class="pointer alert alert-primary">${usuario.nombre}</p>`
          );
        }
      });
    }
  
    document
      .querySelector("#CajaUsuariosConectados")
      .addEventListener("click", function (e) {
        let data = e.target.childNodes[0].data;
        $CajaChatsAbiertos.append(`<p class="pointer alert alert-primary">${data}</p>`);
        console.log(data);
      });
  
    document
      .querySelector("#CajaChatsAbiertos")
      .addEventListener("click", (e) => {
        if (e.target.childNodes[0].data == "General") {
          aquien.id = undefined;
          aquien.nombre = undefined;
          aquien.room = "General";
          console.log(aquien);
  
          document.querySelector("#TituloChatAbierto").innerHTML = aquien.room;
        } else {
          let data = e.target.childNodes[0].data;
  
          let usuarioArray = arrayUsuarios.find(
            (elemento) => elemento.nombre == data
          );
  
          aquien.id = usuarioArray.id;
          aquien.nombre = data;
          aquien.room = data;
  
          console.log(aquien);
          document.querySelector("#TituloChatAbierto").innerHTML = aquien.room;
        }
      });
  
    // Registrar el usuario
  
    $FormularioRegistro.submit((e) => {
      e.preventDefault();
      miUsuario = {
        nombre: $RegistroNombre.val(),
        id: socket.id,
      };
  
      $CajaChatsAbiertos.append(`<p class="pointer alert alert-primary">General</p>`);
  
      //Mandando al servidor el usuario registrado
  
      socket.emit("registroUsuario", miUsuario);
      
      document.querySelector("#RegistroNombre").setAttribute("disabled", "");
    });
  
    // Recibiendo los usuarios conectados desde el servidor
  
    socket.on("usuarios", (data) => {
      arrayUsuarios = data;
  
      usuariosConectados(arrayUsuarios);
      /* 
              arrayUsuarios.forEach(usuario => {
              $CajaUsuariosConectados.append(`<p class="pointer">${usuario.nombre}</p>`);    
              });
             */
    });
  
    //Mandar un mensaje en el canal General
    $FormularioMensaje.submit((e) => {
      e.preventDefault();
  
      dequien = {
        id: socket.id,
        nombre: miUsuario.nombre,
        room: aquien.room,
      };
  
      let mensaje = $TextoMensaje.val();
  
      socket.emit("enviarMensaje", mensaje, dequien, aquien);
      
      $TextoMensaje.val('');
    });
  
    //Recibimos el mensaje desde el servidor para el chat General
    //Lo ponemos en la cajaMensajesGeneral
    socket.on("mensaje", (mensaje, dequien, aquien) => {
      console.log(mensaje);
      console.log(dequien);
      console.log(aquien);
  
      if(aquien.room == 'General'){
        $CajaMensajesGeneral.append(`<p><span class='alert alert-info d-block'>${dequien.nombre}:</span> ${mensaje}</p>`);
      }else{
        $CajaMensajesGeneral.append(`<p><span class='alert alert-danger d-block'>${dequien.nombre}(mensaje privado a ${aquien.nombre}):</span> ${mensaje}</p>`);
      }
  
    });
  });