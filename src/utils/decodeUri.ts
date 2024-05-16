export function decodeUriComponentSafe(component: string): string {
  try {
    return decodeURIComponent(component)
  } catch (e) {
    throw new Error(`Error decoding URI component: ${e}`)
  }
}
