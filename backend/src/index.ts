import cors from 'cors'
import express, { type Request, type Response } from 'express'
import { dbConnection } from './db/db.js'
import logger from './utils/logger.js'

const app = express()

const port = 443
app.use(
  cors({
    origin: 'http://localhost:5174',
  })
)

dbConnection()

app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.get('/', (req: Request, res: Response) => {
  res.send('hii from EC2 !!')
})

app.listen(port, () => {
  logger.info(`server is running on  ${port}`)
})
