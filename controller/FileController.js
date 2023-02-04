class FileController {
  subirArchivo = async (req, res, next) => {
    
      const archivo = req.files.archivo;
      const fileName = archivo.name;
      const path = __dirname + "/../uploads/" + fileName;

      console.log('***********INFORMACIÓN SOBRE EL mimetype************\n\n');
      console.log(archivo.mimetype);
      console.log('el tipo de dato de archivo.mimetype: ', typeof archivo.mimetype)
      console.log('************FIN ARCHIVO************');

      

            if (archivo.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
            archivo.mimetype == 'application/rtf' || 
            archivo.mimetype == 'application/vnd.oasis.opendocument.text' || 
            archivo.mimetype == 'application/msword' ||
            archivo.mimetype ==  'application/msword' ||
            archivo.mimetype == 'text/plain'){
              
                              archivo.mv(path, (error) => {
                                if (error) {
                                  console.error(error);
                                  res.writeHead(500, {
                                    "Content-Type": "application/json",
                                  });
                                  res.end(JSON.stringify({ status: "error", message: error }));
                                  return;
                                }
                                return res.status(200)
                                  .send({ status: "success", path: fileName });
                              });

            }else{
              res.status(500).json({
                error: true,
                message: 'NO SE ACEPTA ESE FORMATO',
              });
            }
          }
        }

                //copiar el archivo desde uploads hasta publicaciones:
       

     

module.exports = FileController;
