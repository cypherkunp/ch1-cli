export interface ContentItem {
  id: string
  name: string
  fields: {
    sectionName: {
      value: string
      type: string
    }
    bottomBorder: {
      value: boolean
      type: string
    }
    hasShadow: {
      value: boolean
      type: string
    }
    component: {
      value: { id: string }[]
      type: string
    }
    type: {
      value: { id: string }[]
      type: string
    }
    animation: {
      value: { id: string }[]
      type: string
    }
    items: {
      value: {
        type: string
        relatedType: string
        id: string
        uri: string
      }[]
      type: string
    }
    heading: {
      value: any[] // Assuming any type for now
      type: string
    }
    categories: {
      value: any[] // Assuming any type for now
      type: string
    }
  }
  system: {
    contentType: {
      type: string
      relatedType: string
      id: string
      uri: string
    }
    lastPublishProgress: {
      type: string
      status: string
      triggeredBy: {
        type: string
        relatedType: string
        id: string
        uri: string
      }
      triggeredAt: string
    }
    type: string
    version: string
    status: string
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
    publishedBy: any // Assuming any type for now
    publishedAt: string
  }
}
