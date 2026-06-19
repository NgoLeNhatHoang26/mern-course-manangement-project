import { env } from './config/env.js'
import { logger } from './config/logger.js'

const { connectDB } = await import('./lib/db.js')
const { connectRedis } = await import('./lib/redis.js')
const { default: app } = await import('./app.js')

const PORT = env.PORT


await connectDB()
await connectRedis()

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server ready -> http://localhost:${PORT}`)
})
