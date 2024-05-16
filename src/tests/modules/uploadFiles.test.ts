import request from 'supertest'
import app from '@/config/app' // Path to your Express application
import fs from 'fs'
import path from 'path'
import os from 'os'

describe('POST /api/upload', () => {
  const fileBuffer = Buffer.from('test file content')
  const fileName = 'testfile.zip'
  const lastModified = new Date().getTime()
  let tempDir: string
  let fileId: number

  beforeEach(async () => {
    // Create temporary directory
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'))
  })

  afterAll(async () => {
    const response = await request(app).delete(`/api/file/${fileId}`)
    expect(response.status).toBe(200)
  }, 10000)

  it('should handle file upload', async () => {
    // Change UPLOAD_DIR to temporary directory
    process.env.UPLOAD_DIR = tempDir

    const response = await request(app)
      .post('/api/upload')
      .field('fileNames', fileName) // Add text field
      .field('filesLastModified', lastModified)
      .attach('files', fileBuffer, {
        contentType: 'application/zip',
        filename: encodeURIComponent(fileName),
      })

    fileId = response.body.files[0].id

    expect(response.status).toBe(200)
    expect(response.body.files[0].id).toBe(fileId)
    expect(response.body.files).toEqual(expect.any(Array))
    expect(response.body.files[0].name).toBe('testfile.zip')
  })

  // it('should handle few files upload', async () => {
  //   const response = await request(app)
  //     .post('/api/upload')
  //     .attach('file1', Buffer.from('test file content'), 'testfile1.zip')
  //     .attach('file2', Buffer.from('test file content'), 'testfile2.zip')

  //   expect(response.status).toBe(400)
  //   expect(response.body.error).toBe('Max files exceeded')
  // })
})
