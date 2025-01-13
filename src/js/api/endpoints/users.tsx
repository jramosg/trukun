// src/api/endpoints/users.ts
import { NewUser, User } from '../../types/user'
import api from '../../lib/apiClient'

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    // GET /users - Fetch all users
    getUsers: build.query<NewUser[], void>({
      query: () => '/users',
    }),

    // POST /user - Add a new user
    addUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: '/user',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
  overrideExisting: false,
})

// Export hooks for usage in components
export const { useGetUsersQuery, useAddUserMutation } = usersApi
