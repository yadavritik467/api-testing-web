import cors from 'cors'
import express, { type Request, type Response } from 'express'
import { dbConnection } from './db/db.js'
import logger from './utils/logger.js'
import { configDotenv } from 'dotenv'
import { FRONT_URL, PORT } from './config/environment.js'
import { errorMiddleware } from './middleware/error.middleware.js'
import userRoutes from './routes/user.route.js'

configDotenv({ path: './.env' })

const app = express()

app.use(
  cors({
    origin: FRONT_URL,
  })
)

dbConnection()

app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use('/api/v1', userRoutes)

app.use(errorMiddleware)
app.get('/', (req: Request, res: Response) => {
  res.send('hii from EC2 !!')
})

app.listen(PORT, () => {
  logger.info(`server is running on  ${PORT}`)
})
