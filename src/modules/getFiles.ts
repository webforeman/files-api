import { Request, Response } from 'express'
import { pool } from '@/config/db'
import { logger } from '@/config/logger'
import { getMessage } from '@/utils/getMessage'

export const getFiles = async (req: Request, res: Response) => {
  try {
    const query =
      'SELECT id, original_filename, file_size, content_type, last_modified, file_checksum, file_path FROM files'
    const result = await pool.query(query)
    const files = result.rows.map((file) => ({
      id: file.id,
      name: file.original_filename,
      size: file.file_size,
      type: file.content_type,
      lastModified: file.last_modified,
      md5: file.file_checksum,
      path: file.file_path,
    }))

    res.json(files)
    logger.info(getMessage('en', 'getFiles', 'fetchSuccess'))
  } catch (error) {
    logger.error(getMessage('en', 'getFiles', 'fetchError'), error)
    res.status(500).send(getMessage('en', 'getFiles', 'fetchError'))
  }
}
