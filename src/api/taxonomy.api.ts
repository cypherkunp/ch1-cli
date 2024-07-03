import * as fs from 'fs'

import { CH1_BASE_URL, CH1_TAXONOMY_URL, PAGE_SIZE } from '../ch1.config'
import { del, delay, get, getDirPath, getResourceUrlWithPagination } from '../ch1.utils'

import { TaxonomyItem } from './taxonomy.type'

/**
 * DELETE <Base_URL> /api/content/v1/taxonomies/taxonomyId
 * cannot be delete if in use
 */
export async function deleteTaxonomy(taxonomyId: string): Promise<void> {
  const url = `${CH1_BASE_URL}${CH1_TAXONOMY_URL}/${taxonomyId}`
  try {
    const response = await del(url)
    console.log(`INFO: Deleting taxonomy with id ${taxonomyId}:`, response)
  } catch (error) {
    console.error('ERROR: Issue while deleting taxonomy at uri: ', url)
  }
}

export async function deleteAllTaxonomies(): Promise<void> {
  const allTaxonomies = await fetchAllTaxonomyItems()
  const taxonomyList = allTaxonomies.map(taxonomy => taxonomy.id).filter(taxonomyId => !!taxonomyId)

  for (const taxonomyId of taxonomyList) {
    await deleteTaxonomy(taxonomyId)
  }
}

export async function fetchAllTaxonomyItems(): Promise<TaxonomyItem[]> {
  const taxonomyResourceUrl = `${CH1_BASE_URL}${CH1_TAXONOMY_URL}`

  let pageNumber = 1
  let allData: TaxonomyItem[] = []

  try {
    const mediaApiResponse = await get(
      getResourceUrlWithPagination(taxonomyResourceUrl, pageNumber, PAGE_SIZE)
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
        getResourceUrlWithPagination(taxonomyResourceUrl, pageNumber, PAGE_SIZE)
      )
      allData = allData.concat(nextFetchResponse.data)
    }

    return allData
  } catch (error) {
    console.error('Error at fetchAllTaxonomyItems')
    throw error
  }
}

export async function backupAllTaxonomies() {
  const allTaxonomies = await fetchAllTaxonomyItems()
  console.log('Taxonomies fetched:', allTaxonomies.length, 'items')

  const response = {
    totalCount: allTaxonomies.length,
    data: allTaxonomies
  }

  const dirPath = getDirPath()
  const filePath = `${dirPath}/taxonomies.json`

  fs.writeFileSync(filePath, JSON.stringify(response, null, 2))
  console.log('Data fetched and saved to taxonomies.json')
  return response
}
