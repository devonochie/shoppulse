import app from "./app";
import { PORT } from "./src/config/connect";
import logger from "./src/utils/logger";


app.listen(PORT, () => {
    logger.info(`Server is up at http://localhost:${PORT}`)
})