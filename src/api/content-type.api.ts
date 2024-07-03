import * as fs from 'fs'

import { CH1_BASE_URL, CH1_CONTENT_TYPE_URL, PAGE_SIZE } from '../ch1.config'
import { del, delay, get, getDirPath, getResourceUrlWithPagination } from '../ch1.utils'

import { ContentType } from './content-type.type'

/**
 * DELETE <Base_URL>/api/content/v1/types/<contentTypeId>
 * unpublish content item before deleting
 */
export async function deleteContentTypeItem(contentTypeId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_CONTENT_TYPE_URL}/${contentTypeId}`
  try {
    const response = await del(url)
    console.log(`Content with id ${contentTypeId} deleted:`, response)
  } catch (error) {
    console.error('Error deleting content type at uri: ', url)
    throw error
  }
}

export async function deleteAllContentTypeItems(): Promise<void> {
  const allContentTypes = await fetchAllContentTypeItems()
  const contentTypeList = allContentTypes
    .map(contentType => contentType.id)
    .filter(contentTypeId => !!contentTypeId)

  for (const contentTypeId of contentTypeList) {
    await deleteContentTypeItem(contentTypeId)
  }
}

export async function fetchAllContentTypeItems(): Promise<ContentType[]> {
  const contentTypeUrl = `${CH1_BASE_URL}${CH1_CONTENT_TYPE_URL}`

  let pageNumber = 1
  let allData: ContentType[] = []

  try {
    const mediaApiResponse = await get(
      getResourceUrlWithPagination(contentTypeUrl, pageNumber, PAGE_SIZE)
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
        getResourceUrlWithPagination(contentTypeUrl, pageNumber, PAGE_SIZE)
      )
      allData = allData.concat(nextFetchResponse.data)
    }

    return allData
  } catch (error) {
    console.error('Error at fetchAllContentTypeItems')
    throw error
  }
}

export async function backupAllContentTypes() {
  const allContentType = await fetchAllContentTypeItems()
  console.log('Content Type fetched:', allContentType.length, 'items')

  const response = {
    totalCount: allContentType.length,
    data: allContentType
  }

  const dirPath = getDirPath()
  const filePath = `${dirPath}/contentType.json`

  fs.writeFileSync(filePath, JSON.stringify(response, null, 2))
  console.log('Data fetched and saved to contentType.json')

  return response
}
