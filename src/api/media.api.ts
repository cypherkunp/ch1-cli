import * as fs from 'fs'

import { CH1_BASE_URL, CH1_MEDIA_URL, PAGE_SIZE } from '../ch1.config'
import {
  del,
  delay,
  get,
  getDirPath,
  getResourceUrlWithPagination,
  saveMediaToFile
} from '../ch1.utils'

import { MediaItem } from './media.type'

/**
 * DELETE <Base_URL>/api/content/v1/media/<mediaId>/publish
 */
export async function unpublishMediaItem(mediaId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_MEDIA_URL}/${mediaId}/publish`
  try {
    const response = await del(url)
    console.log('Media unpublished:', response)
  } catch (error) {
    console.error('Error unpublishing media:', error)
  }
}

/**
 * DELETE <Base_URL>/api/content/v1/media/mediaId
 * unpublish media before deleting
 */
export async function deleteMediaItem(mediaId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_MEDIA_URL}/${mediaId}`
  try {
    const response = await del(url)
    console.log('Media deleted:', response)
  } catch (error) {
    console.error('Error deleting media at url', url)
    throw error
  }
}

export async function unpublishAllMediaItems(): Promise<void> {
  const allMediaItems = await fetchAllMedia()
  const mediaItemList = allMediaItems
    .map(mediaItem => mediaItem.id)
    .filter(mediaItemId => !!mediaItemId)

  for (const mediaId of mediaItemList) {
    await unpublishMediaItem(mediaId)
  }
}

export async function deleteAllMediaItems(): Promise<void> {
  const allMediaItems = await fetchAllMedia()
  const mediaItemList = allMediaItems
    .map(mediaItem => mediaItem.id)
    .filter(mediaItemId => !!mediaItemId)

  for (const mediaId of mediaItemList) {
    await deleteMediaItem(mediaId)
  }
}

export async function fetchAllMedia(): Promise<MediaItem[]> {
  const mediaResourceUrl = `${CH1_BASE_URL}${CH1_MEDIA_URL}`

  let pageNumber = 1
  let allData: MediaItem[] = []

  try {
    const mediaApiResponse = await get(
      getResourceUrlWithPagination(mediaResourceUrl, pageNumber, PAGE_SIZE)
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
        getResourceUrlWithPagination(mediaResourceUrl, pageNumber, PAGE_SIZE)
      )
      allData = allData.concat(nextFetchResponse.data)
    }

    return allData
  } catch (error) {
    console.error('Error at fetchAllMedia')
    throw error
  }
}

export async function backupAllMedia() {
  const allMedia = await fetchAllMedia()
  console.log('Total media items fetched:', allMedia.length, 'items')

  const response = {
    totalCount: allMedia.length,
    data: allMedia
  }

  const dirPath = getDirPath()
  const fileName = 'media.json'
  const filePath = `${dirPath}/${fileName}`

  fs.writeFileSync(filePath, JSON.stringify(response, null, 2))
  console.log(`Media fetched and saved to ${fileName}`)

  allMedia.forEach(async (media: MediaItem) => {
    const mediaUrl = media.file?.link?.uri
    const mediaId = media.file?.link?.id
    const filePath = `${getDirPath()}/media/${mediaId}-${media.name}`

    await delay(500)
    await saveMediaToFile(mediaUrl, filePath)
  })

  return response
}
