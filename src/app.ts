import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import mysql from "mysql2";
import "reflect-metadata";
import { errorHandler } from "./errors/errorHandler";
import router from "./routes";
// import core_router from "./core/routes";
dotenv.config({ path: "../.env" });
const app = express();
app.use(
  "/api/uploads",
  express.static(__dirname?.replace(/\/src/g, "") + "/uploads")
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Sử dụng cors middleware
app.use(cors());
// Middleware để xử lý dữ liệu đầu vào
var bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Sử dụng router
// app.use('/api', core_router);
app.use("/api", router);
// Đăng ký middleware xử lý lỗi toàn cục
app.use(errorHandler);
// Middleware tùy chỉnh để xử lý dữ liệu đầu vào
app.use((req: Request, _: Response, next: NextFunction) => {
  // Xử lý dữ liệu đầu vào của request trước khi tiếp tục xử lý
  req.body = escapeRequestBody(req.body);
  next();
});
// Hàm tùy chỉnh để escape dữ liệu đầu vào
function escapeRequestBody(data: any): any {
  // Xử lý và escape dữ liệu theo ý muốn của bạn
  // Ví dụ: sử dụng mysql.escape để escape dữ liệu
  if (typeof data === "object") {
    for (let key in data) {
      if (typeof data[key] === "string") {
        data[key] = mysql.escape(data[key]);
      }
    }
  }
  return data;
}

// Xử lý các route không tồn tại
app.use((_: Request, res: Response) => {
  res.json({ message: "Không tìm thấy đường dẫn" });
});

export default app;
