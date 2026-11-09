import { AppError } from "./AppError.js";

export class UnauthorizedError extends AppError {
    constructor(message = "No autorizado") {
        super(message);
        this.name = "UnauthorizedError";
        this.statusCode = 401;
    }
}