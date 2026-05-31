import contentData from '@/content/pl.json'
import type { SiteContent } from '@/types/content'

const content = contentData as SiteContent

export function useContent(): SiteContent {
  return content
}
