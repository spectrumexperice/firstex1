import {configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import partnerReducer from './partnerSlice'
export const store=configureStore({
    reducer:{
       user:userReducer,
       partner:partnerReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
