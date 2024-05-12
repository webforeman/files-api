import app from './config/app'
import { logger } from './config/logger'

const PORT = process.env.BACKEND_PORT || 4200
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))
