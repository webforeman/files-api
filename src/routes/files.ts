import { Router } from 'express'
import sanitize from 'sanitize-filename'
import { getFiles } from '@/modules/getFiles'
import { uploadFiles } from '@/modules/uploadFiles'
import { downloadFile } from '@/modules/downloadFile'
import { deleteFile } from '@/modules/deleteFile'
import { createZIPandDownload } from '@/modules/createZIPandDownload'

const router = Router()

// Marshrute for getting all files
router.get('/api/files', getFiles)

// Route for uploading files
router.post('/api/upload', uploadFiles)

// Route for downloading file
router.get('/api/file/:id', downloadFile)

// Route for deleting file
router.delete('/api/file/:id', deleteFile)

// Route for creating ZIP-archive from files by IDs and download it
router.post('/api/files/zip', createZIPandDownload)

export default router
