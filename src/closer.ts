import { warning } from '@actions/core'
import { marked } from 'marked'

export function shouldBeClosed(input: string): boolean {
  if (!input) {
    warning("suspiciously empty issue body")
  }

  let canBeClosed = true
  marked.use({ walkTokens: (token) => {
    if (token.type === "list_item" && token.checked !== undefined && !token.checked)
      canBeClosed = false
  }})

  marked.parse(input)

  return canBeClosed
}