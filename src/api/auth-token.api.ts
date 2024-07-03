import axios, { AxiosResponse } from 'axios'
import {
  CH1_CLIENT_ID,
  CH1_CLIENT_SECRET,
  CH1_AUTH_TOKEN_URL,
  CH1_AUTH_AUDIENCE,
  CH1_AUTH_GRANT_TYPE
} from '../ch1.config'

export async function getAuthToken(): Promise<AxiosResponse> {
  const data = {
    grant_type: CH1_AUTH_GRANT_TYPE,
    client_id: CH1_CLIENT_ID,
    client_secret: CH1_CLIENT_SECRET,
    audience: CH1_AUTH_AUDIENCE,
    authority: CH1_AUTH_TOKEN_URL
  }
  const response = await axios.post('/endpoint', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    transformRequest: [
      data => {
        return Object.entries(data)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value as string | number | boolean)}`
          )
          .join('&')
      }
    ]
  })

  console.log('Auth token response:', response.data)

  return response.data
}
