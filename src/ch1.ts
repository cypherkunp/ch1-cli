import axios, { AxiosError } from 'axios'

import { deleteAllContentItems, unpublishAllContentItems } from './api/content.api'
import { deleteAllMediaItems, unpublishAllMediaItems } from './api/media.api'
import { deleteAllTaxonomies } from './api/taxonomy.api'
import { deleteAllContentTypeItems } from './api/content-type.api'

async function main() {
  const command = process.argv.slice(2)[0].trim()
  if (!command) {
    throw new Error('Please enter a command')
  }

  try {
    if (command === 'content:unpublish') {
      await unpublishAllContentItems()
    } else if (command === 'media:unpublish') {
      await unpublishAllMediaItems()
    } else if (command === 'content:delete') {
      await deleteAllContentItems()
    } else if (command === 'media:delete') {
      await deleteAllMediaItems()
    } else if (command === 'content-type:delete') {
      await deleteAllContentTypeItems()
    } else if (command === 'taxonomy:delete') {
      await deleteAllTaxonomies()
    } else {
      throw new Error(`Invalid command: ${command}`)
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError: AxiosError = error
      console.error(
        'Axios error:',
        `STATUS: ${axiosError.response?.status} | MESSAGE: ${axiosError.message}`
      )
      if (error['code'] === 'ERR_BAD_REQUEST') {
        throw new Error(
          'Authentication failed. Please check the BEARER_TOKEN in ch1.config.ts file.'
        )
      }
    } else {
      console.error('An error occurred:')
    }
  }
}

main()
