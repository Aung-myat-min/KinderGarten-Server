export type CustomResponse<T = null> = {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: string;
};
