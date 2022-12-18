class FileController {
  subirArchivo = async (req, res, next) => {
    try {
      const archivo = req.files.archivo;
      const fileName = archivo.name;
      const path = __dirname + "/../uploads/" + fileName;
      console.log('variable fileName',fileName);

      try {
        archivo.mv(path, (error) => {
          if (error) {
            console.error(error);
            res.writeHead(500, {
              "Content-Type": "application/json",
            });
            res.end(JSON.stringify({ status: "error", message: error }));
            return;
          }
          return res
            .status(200)
            .send({ status: "success", path: fileName });
        });

        //copiar el archivo desde uploads hasta publicaciones:
       

      } catch (e) {
        res.status(500).json({
          error: true,
          message: e.toString(),
        });
      }
    } catch (error) {
        console.log(error);
    }
  };
}

module.exports = FileController;
