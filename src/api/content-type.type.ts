interface ContentTypeField {
  id: string
  name: {
    [key: string]: string // Assuming language codes are keys and values are strings
  }
  type: string
  required: boolean
  helpText: {
    [key: string]: string // Assuming language codes are keys and values are strings
  }
  reference: {
    type: string
    relatedType: string
    id: string
    uri: string
  } | null
  rules?: any // Assuming rules can be any type
}

interface ContentTypeSystem {
  type: string
  version: string
  status: any // Assuming status can be any type
  createdBy: {
    type: string
    relatedType: string
    id: string
    uri: string
  }
  createdAt: string
  updatedBy: {
    type: string
    relatedType: string
    id: string
    uri: string
  }
  updatedAt: string
  publishedBy: any // Assuming publishedBy can be any type
  publishedAt: any // Assuming publishedAt can be any type
}

export interface ContentType {
  id: string
  name: {
    [key: string]: string // Assuming language codes are keys and values are strings
  }
  description: {
    [key: string]: string // Assuming language codes are keys and values are strings
  }
  fields: ContentTypeField[]
  system: ContentTypeSystem
}
