import express, { Express } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fileRoutes from '../routes/files'

import path from 'path'
import fs from 'fs'
import fileUpload from 'express-fileupload'
import { getMessage } from '@/utils/getMessage'

dotenv.config()

// Folder for saving uploaded files
export const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
// Folder for saving temporary files
export const TEMP_DIR = path.join(__dirname, '..', 'tmp')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })
fs.mkdirSync(TEMP_DIR, { recursive: true })

const app: Express = express()
// Disable the X-Powered-By header
app.disable('x-powered-by')

// Enable parsing of JSON-formatted request bodies
app.use(express.json())

// CORS
const corsOptions = {
  // Allow requests only from this origin or use true for all domains
  origin: `http://localhost:${process.env.FRONTEND_PORT}`,
  optionsSuccessStatus: 200,
  // Headers that you want to allow
  exposedHeaders: ['X-Filename'],
}

app.use(cors(corsOptions))

// Enable file uploading
app.use(
  fileUpload({
    // Use temporary files instead of memory for managing the upload process
    useTempFiles: true,
    tempFileDir: '../tmp/',
    // uriDecodeFileNames: false, Encode the file name in URL,
    createParentPath: true,
    // Maximum file size in bytes (512 MB)
    limits: { fileSize: 512 * 1024 * 1024 },
    // Abort the request if the file exceeds the limit
    abortOnLimit: true,
    // Error message
    responseOnLimit: getMessage('en', 'app', 'fileSizeLimit'),
    // Remove characters that are not alphanumeric or underscores (manually clean the name using sanitize)
    safeFileNames: false,
    // Save the file extension
    preserveExtension: true,
    // Enable debugging in development mode
    debug: process.env.NODE_ENV !== 'production',
    // Timeout for uploading the file (in milliseconds, 60000 ms = 60 seconds)
    uploadTimeout: 60000,
  })
)

app.use('/', fileRoutes)

export default app
