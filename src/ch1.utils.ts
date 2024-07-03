import * as fs from 'fs'

import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

import { BEARER_TOKEN, VERSION_BACKUP_FILES } from './ch1.config'

export function getTimeStamp() {
  const date = new Date(Date.now())

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${day}-${month}-${year}-${hours}-${minutes}-${seconds}`
}

export function getDirPath() {
  const dirName = VERSION_BACKUP_FILES
    ? `${__dirname}/backup-${getTimeStamp()}`
    : `${__dirname}/backup`
  const mediaDirName = VERSION_BACKUP_FILES ? `${dirName}/media` : `${dirName}/media`

  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true })
  }
  if (!fs.existsSync(mediaDirName)) {
    fs.mkdirSync(mediaDirName, { recursive: true })
  }

  return dirName
}

export function getResourceUrlWithPagination(
  resourceUrl: string,
  pageNumber: number,
  pageSize: number
) {
  return `${resourceUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}`
}

export function getResourceUrlWithPaginationForContent(
  resourceUrl: string,
  pageNumber: number,
  pageSize: number,
  contentType: string
) {
  return `${resourceUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&system.contentType.id=${contentType}`
}

export async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function saveMediaToFile(url: string, filePath: string): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    if (response.data) {
      fs.writeFileSync(filePath, response.data)
      console.log(`Media saved successfully to ${filePath}`)
    } else {
      console.error('Failed to get data from the response')
    }
  } catch (error) {
    console.error('Error occurred while fetching or saving the file:', error)
  }
}

export async function get(
  resourceUrl: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse> {
  try {
    const response = await axios.get(resourceUrl, {
      ...config,
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    })
    return response
  } catch (error) {
    console.error(`Error fetching data from url: ${resourceUrl}`, error)
    throw error
  }
}

export async function del(resourceUrl: string): Promise<void> {
  try {
    await axios.delete(resourceUrl, {
      headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
      }
    })
    console.log(`Resource deleted successfully: ${resourceUrl}`)
  } catch (error) {
    console.error(`Error deleting resource from url: ${resourceUrl}`, error)
    throw error
  }
}
