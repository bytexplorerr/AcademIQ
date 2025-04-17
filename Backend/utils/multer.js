import multer from "multer";

const upload = multer({dest:'uploads/'}); // will create the folder name 'uploads' in server to store the images.

export default upload;