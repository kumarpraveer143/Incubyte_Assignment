import {configureStore} from "@reduxjs/toolkit"
import userDataReducer from "./slice/userDataSlice"
import sweetReducer from "./slice/sweetSlice"
import categoryReducer from "./slice/categorySlice"

export const store=configureStore({
    reducer:{
        userData:userDataReducer,
        categorys:categoryReducer,
        sweets:sweetReducer
    }
})

export type ReduxStoreType= ReturnType<typeof store.getState>;
export type ReduxDispatchType= typeof store.dispatch;