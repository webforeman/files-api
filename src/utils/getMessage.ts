import {} from '../config/types'
import { PlaceMessages, LocaleMessages, LanguageMessages } from '@/config/types'
import { messages } from './messages'

// Function for getting localized message
export function getMessage(
  locale: keyof LocaleMessages,
  place: keyof LanguageMessages,
  messageId: keyof PlaceMessages,
  ...params: (string | number)[]
): string {
  const placeMessages = messages[locale][place]
  const message = placeMessages[messageId]

  // Return message if it is not a function
  if (typeof message !== 'function') {
    return message
  }

  // Processing dynamic message depending on type and number of parameters
  if (params.length === 0) {
    return (message as () => string)()
  }

  const param = params[0]
  if (typeof param === 'number') {
    return (message as (id: number) => string)(param)
  } else if (typeof param === 'string') {
    return (message as (text: string) => string)(param)
  }

  // If parameters do not match expected, generate an error
  throw new Error('Invalid parameters for message function')
}
