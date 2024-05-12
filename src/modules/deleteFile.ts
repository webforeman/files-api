import { Request, Response } from 'express'
import { pool } from '@/config/db'
import { getMessage } from '@/utils/getMessage'
import { logger } from '@/config/logger'
import fs from 'fs'

export const deleteFile = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    // Get file info from database
    const result = await pool.query(
      'SELECT file_path FROM files WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      const errorMessage = getMessage('en', 'deleteFile', 'fileNotFound')
      logger.error(errorMessage)
      return res.status(404).json({ message: errorMessage })
    }
    const filePath = result.rows[0].file_path

    // Delete file from disk
    fs.unlink(filePath, async (err) => {
      if (err) {
        const errorMessage = getMessage('en', 'deleteFile', 'deleteError')
        logger.error(errorMessage, err)
        return res.status(500).json({ message: errorMessage })
      }

      // Delete file record from database
      await pool.query('DELETE FROM files WHERE id = $1', [id])
      const successMessage = getMessage('en', 'deleteFile', 'deleteSuccess')
      logger.info(successMessage)
      res.json({ message: successMessage })
    })
  } catch (error) {
    const errorMessage = getMessage('en', 'deleteFile', 'deleteError')
    logger.error(errorMessage, error)
    res.status(500).json({ message: errorMessage })
  }
}
