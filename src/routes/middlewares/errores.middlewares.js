import { ErrorEnum } from "../../services/errors/enums.js";

export const errorMiddleware = (error, req, res, next) => {
    console.log(error);
    console.log("error midlleware");
    switch (error.code) {
        case ErrorEnum.INVALID_TYPES_ERROR:
            res.send({ status: "error", error: error.name, cause: error.cause })
            break;
        case ErrorEnum.ROUTING_ERROR:
            res.send({ status: "error", error: error.name, cause: error.cause })
            return
        case ErrorEnum.DATABASE_ERROR:
            res.send({ status: "error", error: error.name, cause: error.cause })
            return
        case ErrorEnum.PARAM_ERROR:
            res.send({ status: "error", error: error.name, cause: error.cause })
            return
        case ErrorEnum.DATA_ERROR:
            res.send({ status: "error", error: error.name, cause: error.cause })
            return
        case ErrorEnum.INVALID_ID:
            res.send({ status: "error", error: error.name, cause: error.cause })
            return
        default:
            res.send({ status: "error", message: "error no manejado" })
            break;
    }
}