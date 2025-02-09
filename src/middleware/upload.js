import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img"); // Guardar imágenes en la carpeta "img"
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Evita nombres duplicados
    }
});

const upload = multer({ storage });

export { upload };
