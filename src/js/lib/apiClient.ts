// src/api/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import config from '../config/config.json'
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: config.API_BASE_URL,
  credentials: 'include',
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          '/refreshToken',
          api,
          extraOptions,
        )
        if (refreshResult.data) {
          alert('Token received!')
          // retry the initial query
          result = await baseQuery(args, api, extraOptions)
        } else {
          alert('Logout!')
        }
      } finally {
        // release must be called once the mutex should be released again.
        release()
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }
  return result
}

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Post', 'User'], // Add tagTypes shared across modules
  endpoints: () => ({}), // Empty for now; endpoints will be added later
})

export default api
