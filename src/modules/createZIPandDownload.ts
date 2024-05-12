import { Request, Response } from 'express'
import archiver from 'archiver'
import { pool } from '@/config/db'
import { getMessage } from '@/utils/getMessage'
import { logger } from '@/config/logger'
import fs from 'fs'

export const createZIPandDownload = async (req: Request, res: Response) => {
  const { ids } = req.body // It is assumed that ids is an array with the file ID

  if (!ids || !Array.isArray(ids)) {
    const errorMessage = getMessage(
      'en',
      'createZIPandDownload',
      'invalidInput'
    )
    logger.error(errorMessage)
    return res.status(400).json({ message: errorMessage })
  }

  const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level
  })

  archive.pipe(res)

  for (let id of ids) {
    try {
      const result = await pool.query('SELECT * FROM files WHERE id = $1', [id])
      const file = result.rows[0]
      if (file) {
        archive.append(fs.createReadStream(file.file_path), {
          name: file.original_filename,
        })
      } else {
        const warningMessage = getMessage(
          'en',
          'createZIPandDownload',
          'fileNotFound',
          id
        )
        logger.warn(warningMessage)
      }
    } catch (error) {
      const errorMessage = getMessage(
        'en',
        'createZIPandDownload',
        'fileProcessError',
        id
      )
      logger.error(errorMessage)
    }
  }

  archive.finalize()
}
