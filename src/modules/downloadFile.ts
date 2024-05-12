import { Request, Response } from 'express'
import { pool } from '@/config/db'
import { getMessage } from '@/utils/getMessage'
import { logger } from '@/config/logger'

export const downloadFile = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await pool.query('SELECT * FROM files WHERE id = $1', [id])
  const file = result.rows[0]
  if (!file) {
    return res
      .status(404)
      .json({ message: getMessage('en', 'downloadFile', 'fileNotFound') })
  }
  // Send filename for client
  res.setHeader('X-Filename', file.original_filename)
  res.download(file.file_path, file.original_filename, (err) => {
    if (err) {
      logger.error(getMessage('en', 'downloadFile', 'downloadError'), err)

      res
        .status(500)
        .json({ message: getMessage('en', 'downloadFile', 'downloadError') })
    } else {
      logger.info(getMessage('en', 'downloadFile', 'downloadSuccess'))
    }
  })
}
