import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

// Matches the JSON shape the original APIRequest::failedValidation() sent:
// { status: 'error', message: '<first validation error>' } with HTTP 400.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      status: "error",
      message: err.issues[0]?.message ?? "驗證失敗",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: "error",
    message: "伺服器發生錯誤",
  });
};
