interface FileLink {
  type: string
  relatedType: string
  id: string
  uri: string
}

interface Dimensions {
  width: number
  height: number
}

interface FileDetails {
  name: string | null
  type: string
  size: number
  link: FileLink
  dimensions: Dimensions
}

interface LastPublishProgress {
  type: string
  status: string
  triggeredBy: FileLink
  triggeredAt: string
}

interface CreatedBy {
  type: string
  relatedType: string
  id: string
  uri: string
}

interface SystemInfo {
  lastPublishProgress: LastPublishProgress
  type: string
  version: string
  status: string
  createdBy: CreatedBy
  createdAt: string
  updatedBy: any // Change to appropriate type if needed
  updatedAt: string
  publishedBy: any // Change to appropriate type if needed
  publishedAt: string
}

export interface MediaItem {
  id: string
  name: string
  description: string
  file: FileDetails
  system: SystemInfo
}
