import multer from "multer";

export const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },

  fileFilter: (req, file, cb) => {

    const tiposPermitidos = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {

      return cb(
        new Error("Solo se permiten archivos PDF, Word (.doc) o Word (.docx)"),
        false
      );

    }

    cb(null, true);

  },

});

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, //2MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes"), false);
    }
  },
});

export const uploadDatos = multer({ storage: multer.memoryStorage() });