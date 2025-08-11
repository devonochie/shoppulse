import dotenv from 'dotenv'
dotenv.config()

const PORT: string = process.env.PORT || "3001"

const MONGO_URI: string | undefined = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGO_URI
    : process.env.MONGO_URI


export { 
    PORT,
    MONGO_URI
}