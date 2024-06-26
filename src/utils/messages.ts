import { LocaleMessages } from '@/config/types'

// Object with localized messages
export const messages: LocaleMessages = {
  en: {
    app: {
      fileSizeLimit: 'File size limit has been reached',
    },
    uploadFiles: {
      noFilesUploaded: 'No files were uploaded.',
      maxFilesExceeded: 'Maximum number of files exceeded.',
      fileUploadSuccess: 'File uploaded successfully.',
      fileInsertSuccess: (id: number) => `Inserted file with ID: ${id}`,
      fileInsertError: 'Error inserting file into database.',
      fileProcessError: 'Error processing files.',
      uploadError: 'Error uploading file.',
      invalidFileType: 'Invalid file type.',
    },
    getFiles: {
      fetchSuccess: 'Files fetched successfully.',
      fetchError: 'Failed to fetch files.',
    },
    downloadFile: {
      downloadSuccess: 'File downloaded successfully.',
      downloadError: 'Failed to download file.',
      fileNotFound: 'File not found.',
    },
    deleteFile: {
      deleteSuccess: 'File deleted successfully.',
      deleteError: 'Failed to delete file.',
      fileNotFound: 'File not found.',
    },
    createZIPandDownload: {
      invalidInput: 'Invalid input: expected an array of file IDs.',
      fileNotFound: (id: number) => `File with ID ${id} not found.`,
      fileProcessError: (id: number) => `Failed to process file with ID ${id}:`,
    },
  },
}
