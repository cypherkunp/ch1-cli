import * as fs from 'fs'

import { CH1_BASE_URL, CH1_CONTENT_URL, PAGE_SIZE } from '../ch1.config'
import { del, delay, get, getDirPath, getResourceUrlWithPaginationForContent } from '../ch1.utils'

import { ContentItem } from './content.type'
import { fetchAllContentTypeItems } from './content-type.api'

/**
 * DELETE <Base_URL>/api/content/v1/items/contentItemId
 */
export async function unpublishContentItem(contentItemId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_CONTENT_URL}/${contentItemId}/publish`
  try {
    const response = await del(url)
    console.log(`Content with id ${contentItemId} unpublished:`, response)
  } catch (error) {
    console.error('Error unpublishing Content item at uri: ', url)
  }
}

/**
 * DELETE <Base_URL>/api/content/v1/items/contentItemId
 * unpublish content item before deleting
 */
export async function deleteContentItem(contentItemId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_CONTENT_URL}/${contentItemId}`
  try {
    const response = await del(url)
    console.log(`Content with id ${contentItemId} deleted:`, response)
  } catch (error) {
    console.error('Error deleting media at uri: ', url)
    throw error
  }
}

export async function unpublishAllContentItems(): Promise<void> {
  const allContentTypes = await fetchAllContentTypeItems()
  const contentTypesWithIds = allContentTypes.map(contentType => contentType.id)

  contentTypesWithIds.forEach(async contentTypeId => {
    const allContentOfContentType = await fetchAllContentItems(contentTypeId)
    console.log(
      `Content of type ${contentTypeId} fetched:`,
      allContentOfContentType.length,
      'items'
    )
    const contentItemList = allContentOfContentType
      .map(contentItem => contentItem.id)
      .filter(contentItemId => !!contentItemId)

    for (const contentItemId of contentItemList) {
      await unpublishContentItem(contentItemId)
    }
  })
}

export async function deleteAllContentItems(): Promise<void> {
  const allContentTypes = await fetchAllContentTypeItems()
  const contentTypesWithIds = allContentTypes.map(contentType => contentType.id)

  contentTypesWithIds.forEach(async contentTypeId => {
    const allContentOfContentType = await fetchAllContentItems(contentTypeId)
    console.log(
      `Content of type ${contentTypeId} fetched:`,
      allContentOfContentType.length,
      'items'
    )
    const contentItemList = allContentOfContentType
      .map(contentItem => contentItem.id)
      .filter(contentItemId => !!contentItemId)

    for (const contentItemId of contentItemList) {
      await deleteContentItem(contentItemId)
    }
  })
}

export async function fetchAllContentItems(contentType = ''): Promise<ContentItem[]> {
  const contentResourceUrl = `${CH1_BASE_URL}${CH1_CONTENT_URL}`

  let pageNumber = 1
  let allData: ContentItem[] = []

  try {
    const mediaApiResponse = await get(
      getResourceUrlWithPaginationForContent(contentResourceUrl, pageNumber, PAGE_SIZE, contentType)
    )
    const response = mediaApiResponse.data
    pageNumber = response.pageNumber
    const totalCount = response.totalCount
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    allData = response.data

    while (pageNumber < totalPages) {
      await delay(500)
      pageNumber++
      const nextFetchResponse = await get(
        getResourceUrlWithPaginationForContent(
          contentResourceUrl,
          pageNumber,
          PAGE_SIZE,
          contentType
        )
      )
      allData = allData.concat(nextFetchResponse.data)
    }

    return allData
  } catch (error) {
    console.error('Error at fetchAllContentItems')
    throw error
  }
}

export async function backupAllContent(contentTypeList: string[]) {
  let totalCount = 0

  contentTypeList.forEach(async contentType => {
    const allContentOfContentType = await fetchAllContentItems(contentType)
    console.log(`Content of type ${contentType} fetched:`, allContentOfContentType.length, 'items')

    const response = {
      totalCount: allContentOfContentType.length,
      data: allContentOfContentType
    }
    totalCount += allContentOfContentType.length
    const dirPath = getDirPath()
    const filePath = `${dirPath}/content.${contentType}.json`

    fs.writeFileSync(filePath, JSON.stringify(response, null, 2))
    console.log('Data fetched and saved to contentType.json')
  })

  return {
    totalCount,
    data: []
  }
}
