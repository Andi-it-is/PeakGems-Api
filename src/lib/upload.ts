import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

export const LOCATION_UPLOAD_DIR = path.join(__dirname, "../../uploads/locations"); // TODO: Pfad an Projektstruktur anpassen
const uploadDir = LOCATION_UPLOAD_DIR;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Nur Bilddateien erlaubt (jpeg, jpg, png, webp)"));
    }
  },
});

export const AVATAR_UPLOAD_DIR = path.join(__dirname, "../../uploads/avatars"); // TODO: Pfad an Projektstruktur anpassen
const avatarUploadDir = AVATAR_UPLOAD_DIR;

if (!fs.existsSync(avatarUploadDir)) {
  fs.mkdirSync(avatarUploadDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowed = /jpeg|jpg|png|webp/;
    const isValid = allowed.test(path.extname(file.originalname).toLowerCase());

    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Nur Bilddateien erlaubt (jpeg, jpg, png, webp)"));
    }
  },
});