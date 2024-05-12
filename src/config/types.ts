import fileUpload from 'express-fileupload'

export type ExtendedUploadedFile = fileUpload.UploadedFile & {
  id?: number
}

// Определяем тип аргументов для функций, возвращающих строки
export type MessageFunction =
  | ((id: number) => string)
  | ((text: string) => string)
  | (() => string)

// Интерфейс для описания сообщений для определённого места
export interface PlaceMessages {
  [key: string]: string | MessageFunction
}

// Интерфейс для языковых сообщений и мест
export interface LanguageMessages {
  [place: string]: PlaceMessages
}

// Интерфейс для всех доступных языков
export interface LocaleMessages {
  [locale: string]: LanguageMessages
}
