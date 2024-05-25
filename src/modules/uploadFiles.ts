import { Request, Response } from 'express'
import { pool } from '@/config/db'
import { logger } from '@/config/logger'
import { ExtendedUploadedFile } from '@/config/types'
import sanitize from 'sanitize-filename'
import { getMessage } from '@/utils/getMessage'
import path from 'path'
import { MAX_FILES, UPLOAD_DIR } from '@/config/app'
import { decodeUriComponentSafe } from '@/utils/decodeUri'

export const uploadFiles = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      const errorMessage = getMessage('en', 'uploadFiles', 'uploadError')
      logger.error(errorMessage)
      return res.status(400).send(errorMessage)
    }
    if (req.files && Object.keys(req.files).length > MAX_FILES) {
      const errorMessage = getMessage('en', 'uploadFiles', 'maxFilesExceeded')
      logger.error(errorMessage)
      return res.status(400).send(errorMessage)
    }
    // In case if in files is a single file
    !Array.isArray(req.files.files) && (req.files.files = [req.files.files])

    let uploadedFiles: ExtendedUploadedFile[] = req.files.files
    let fileNames = req.body.fileNames
    let filesLastModified = req.body.filesLastModified

    const insertPromises = uploadedFiles.map(async (file, id) => {
      if (!Array.isArray(file)) {
        // Filter file extension (zip yet)
        if (path.extname(file.name).toLowerCase() !== '.zip') {
          const errorMessage = getMessage(
            'en',
            'uploadFiles',
            'invalidFileType'
          )
          logger.error(errorMessage)
          return res.status(400).send(errorMessage)
        }
        // If file is not an array, process a single file
        if (!Array.isArray(fileNames) && !Array.isArray(filesLastModified)) {
          fileNames = [fileNames]
          filesLastModified = [filesLastModified]
        }
        // Cleaning file name from unacceptable characters
        let fileName = sanitize(decodeUriComponentSafe(fileNames[id]))

        const uploadPath = path.join(
          process.env.UPLOAD_DIR || UPLOAD_DIR,
          fileName
        )
        await file.mv(uploadPath)

        // Information about file for database
        const fileSize = file.size
        const contentType = file.mimetype
        const fileChecksum = file.md5
        const fileLastModified = filesLastModified[id]
        // SQL-construction INSERT ... ON CONFLICT. Allows you to handle situations where a uniqueness conflict occurs (for example, original_filename must be unique).
        const query = `
        INSERT INTO files (original_filename, file_size, content_type, last_modified, file_checksum, file_path)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (original_filename) DO UPDATE SET
            file_size = EXCLUDED.file_size,
            content_type = EXCLUDED.content_type,
            last_modified = EXCLUDED.last_modified,
            file_checksum = EXCLUDED.file_checksum,
            file_path = EXCLUDED.file_path
        RETURNING id;
      `
        const values = [
          fileName,
          fileSize,
          contentType,
          fileLastModified,
          fileChecksum,
          uploadPath,
        ]

        const result = await pool.query(query, values)

        uploadedFiles[id].id = result.rows[0].id
        logger.info(
          getMessage(
            'en',
            'uploadFiles',
            'fileInsertSuccess',
            result.rows[0].id
          )
        )
      }
    })

    await Promise.all(insertPromises)

    return res.json({
      files: uploadedFiles.map((item) => {
        return {
          id: item.id,
          name: decodeUriComponentSafe(item.name),
          md5: item.md5,
          type: item.mimetype,
          size: item.size,
        }
      }),
    })
  } catch (error) {
    logger.error(getMessage('en', 'uploadFiles', 'uploadError'), error)
    return res.status(500).send(getMessage('en', 'uploadFiles', 'uploadError'))
  }
}
