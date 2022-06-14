/* eslint-disable camelcase */
import React, { createContext, useContext } from 'react'
import { EventEmitter } from 'events'
import { parseCookies } from 'nookies'

export const userEvents = new EventEmitter()

const UserContext = createContext(undefined)

// export const setUserState = () => {
//   userEvents.emit(`userChanged`, {
//     username: `apple`,
//   })
// }

// Based on https://stackoverflow.com/a/61734920/3558475
export const UserProvider = ({ children, cookies }) => {
  const { user } = cookies
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

// UserProvider

export const useUser = () => {
    if (typeof window === 'undefined'){
        return useContext(UserContext)
    } else{
        const cookies = parseCookies()
        const {user} = cookies
        return user
    }
}

