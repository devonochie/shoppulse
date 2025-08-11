import { CartDocument } from "../models/cart";
import { UserDocument } from "../models/auth";
import { OrderDocument } from "../models/order";
import { PaymentDocument } from "../models/payment";


declare global {
    namespace Express {
        interface Request {
            token?: string | null,
            user? : UserDocument | null,
            file?: Express.Multer.File,
            files?: Express.Multer.File[],
            callback?: FileCallback,
            cart?: CartDocument | null,
            order?: OrderDocument | null
            payment?: PaymentDocument
        }
        
        interface Response {
            success(data?: unknown, message?: string): void;
            error(error: string | Error, statusCode?: number): void;
        }
    }
}