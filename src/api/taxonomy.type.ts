interface Name {
  [key: string]: string
}

interface Value {
  id: string
  name: Name
}

interface CreatedBy {
  type: string
  relatedType: string
  id: string
  uri: string
}

interface UpdatedBy {
  type: string
  relatedType: string
  id: string
  uri: string
}

interface System {
  type: string
  version: string
  createdBy: CreatedBy
  createdAt: string
  updatedBy: UpdatedBy
  updatedAt: string
}

export interface TaxonomyItem {
  id: string
  taxonomy: any // you might want to replace `any` with a more specific type if you know the structure
  name: Name
  values: Value[]
  system: System
}
