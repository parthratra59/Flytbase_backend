import { Request } from "express";
interface checkUser {
  _id: string;
  username: string;
  email: string;
}

interface AuthRequest extends Request {
  insertprop?: checkUser; // Adjust the type according to your user structure
}

export { AuthRequest,checkUser}