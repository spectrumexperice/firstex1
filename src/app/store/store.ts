import {configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import partnerReducer from './partnerSlice'
import worksReducer from './workSlice'
import productReducer from './productSlice'
import categoriesReducer from './productSlice'
export const store=configureStore({
    reducer:{
       user:userReducer,
       partner:partnerReducer,
       works:worksReducer,
       product:productReducer,
       categorie:categoriesReducer
    }
})
export type RootState = ReturnType<typeof store.getState>;
