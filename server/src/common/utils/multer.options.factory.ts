import { Logger } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from "multer";
import * as path from "path";
import { mkdirSync, readdirSync } from "fs";
// 안될때 내부로 접근해줘야함

const mkdir = (directory: string) => {
  const logger = new Logger("Mkdir");
  try {
    readdirSync(path.join(process.cwd(), directory));
  } catch (err) {
    logger.log(`지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`);
    mkdirSync(path.join(process.cwd(), directory));
  }
};

mkdir("uploads");

export const multerOptionsFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      destination(req, file, done) {
        done(null, path.join(process.cwd(), "uploads"));
      },

      filename(req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
