import logger from "../utils/logger"
import Redis, { RedisOptions } from "ioredis"


const redisOptions: RedisOptions = {
    host: process.env.REDIS_HOST || "undefinded",
    port: parseInt(process.env.REDIS_PORT! || "17629"),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB! || "0"),
    retryStrategy: (times: number ) => {
        const delay = Math.min(times * 100, 5000)
        return delay
    },
    username: process.env.REDIS_USERNAME || undefined,
    maxRetriesPerRequest: 3,
    enableOfflineQueue: true,
    connectTimeout: 5000
}

class RedisClient {
    public static instance: Redis
    private constructor() {}

    public static getInstance() : Redis {
        if(!RedisClient.instance) {
            RedisClient.instance = new Redis(redisOptions)

            RedisClient.instance.on("connect", () => {
                logger.info("Redis Connected")
            })

            RedisClient.instance.on("error", (error) => {
                logger.error('Redis error', error)
            })

            RedisClient.instance.on('reconnecting', () => {
                logger.warn('Redis connecting...')
            })

            RedisClient.instance.on("close", () => [
                logger.error('Redis connection closed')
            ])
        }
        return RedisClient.instance
    }
}

export const checkRedisHealth = async (): Promise<boolean> => {
    try {
        const pingResponse = await RedisClient.getInstance().ping()
        return pingResponse === "PONG"
    } catch (error) {
        logger.error("Redis health check failed:", error)
        return false
    }
}

export const closeRedis = async (): Promise<void> => {
    if(RedisClient.instance) {
        await RedisClient.instance.quit()
        logger.info('Redis connection closed gracefully')
    }
}

process.on("SIGTERM", closeRedis)
process.on("SIGINT", closeRedis)


export const redis = RedisClient.getInstance()