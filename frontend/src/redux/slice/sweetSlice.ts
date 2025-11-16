import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

// sweet i get from server 
// {
//     "id": 27,
//     "name": "mithai2333333",
//     "price": 1000001211,
//     "quantity": 0,
//     "createdAt": "2025-10-02T01:02:58.955Z",
//     "updatedAt": "2025-10-02T01:02:58.955Z",
//     "categoryId": 29,
//     "category": {
//         "id": 29,
//         "name": "mithai ladoo"
//     }
// }

// output i get when i do perform delete 
// {message:"",id}

// output of search , fetch sweet
// [
//   {
//       "id": 27,
//       "name": "mithai2333333",
//       "price": 1000001211,
//       "quantity": 0,
//       "createdAt": "2025-10-02T01:02:58.955Z",
//       "updatedAt": "2025-10-02T01:02:58.955Z",
//       "categoryId": 29,
//       "category": {
//           "id": 29,
//           "name": "mithai ladoo"
//       }
//   }
// ]

// category type
export interface categorytype{
  id:number,
  name:string
}

// Sweet output type
export interface SweetOutput {
  id?: number;
  name: string;
  categoryId: number;
  price: number;
  quantity:number,
  createdAt:string,
  updatedAt:string,
  category:categorytype
}

// Slice state
interface SweetsState {
  items: SweetOutput[];
  loading: boolean;
  error: string | null;
}

// sweet input type
export interface Sweet {
  id?: number;
  name: string;
  categoryId: number;
  price: number;
}

const initialState: SweetsState = {
  items: [],
  loading: false,
  error: "",
};

export const addSweet = createAsyncThunk<SweetOutput, { sweet: Sweet, token: string }, { rejectValue: string }>(
  "addSweet",
  async ({ sweet, token },{rejectWithValue}) => {
    try {
      console.log(token);
      const response = await axios.post(`${SERVER_URL}/api/sweets`, sweet, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "add failed");
    }
  }
);

export const fetchSweets = createAsyncThunk<SweetOutput[], string,{ rejectValue: string }>(
  "fetchSweets",
  async (token,{rejectWithValue}) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/sweets`, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "fetch failed");
    }
  }
);

export const searchSweets = createAsyncThunk<SweetOutput[], { query: Partial<Sweet>, token: string },{ rejectValue: string }>(
  "searchSweets",
  async ({query, token},{rejectWithValue}) => {
    try {
      // object.entries convert object to array
      const res=Object.entries(query)
      .filter(([_,value])=>value!==undefined && value!=="" && value!==0)
      .map(([key,value])=>[key,String(value)]);
      const params = new URLSearchParams(res).toString();
      const response = await axios.get(`${SERVER_URL}/api/sweets/search?${params}`, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "search failed");
    }
  }
);

export const updateSweet = createAsyncThunk<SweetOutput, { id: number, data: Sweet ,token:string},{ rejectValue: string }>(
  "updateSweet",
  async ({ id, data ,token},{rejectWithValue}) => {
    try {
      const response = await axios.put(`${SERVER_URL}/api/sweets/${id}`, data, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "update failed");
    }
  }
);

export const deleteSweet = createAsyncThunk<{message:string,id:number}, {id:number,token:string},{ rejectValue: string }>(
  "deleteSweet",
  async ({id,token},{rejectWithValue}) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/api/sweets/${id}`, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "delete failed");
    }
  }
);

export const restockSweet= createAsyncThunk<{message:string,sweet:SweetOutput,restockLog:any},{id:number,quantity:number,token:string},{ rejectValue: string }>(
  "restockSweet",
  async ({id,quantity,token},{rejectWithValue})=>{
    try{
      const response = await axios.post(`${SERVER_URL}/api/sweets/${id}/restock`,{quantity},{ headers: { authorization: `Bearer ${token}` } });
      return response.data;
    }catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "restock failed");
    }
  }
)

export const purchaseSweet= createAsyncThunk<{message:string,purchase:any,updated:SweetOutput},{id:number,quantity:number,token:string},{ rejectValue: string }>(
  "purchaseSweet",
  async ({id,quantity,token},{rejectWithValue})=>{
    try{
      const response = await axios.post(`${SERVER_URL}/api/sweets/${id}/purchase`,{quantity},{ headers: { authorization: `Bearer ${token}` } });
      return response.data;
    }catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "purchase failed");
    }
  }
)

const sweetsSlice = createSlice({
  name: "sweets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSweet.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchSweets.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(searchSweets.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateSweet.fulfilled, (state, action) => {
        const idx = state.items.findIndex((s) => s.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteSweet.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s.id !== action.payload?.id);
      })
      .addCase(restockSweet.fulfilled,(state,action)=>{
        const idx=state.items.findIndex((value)=> value.id==action.payload.sweet.id);
        if(idx!=-1) state.items[idx]=action.payload.sweet;
      })
      .addCase(purchaseSweet.fulfilled,(state,action)=>{
        const idx=state.items.findIndex((value)=>value.id==action.payload.updated.id);
        if(idx!=-1) state.items[idx]=action.payload.updated;
      })
      .addMatcher((action) => action.type.startsWith("addSweet/")||action.type.startsWith("fetchSweets/")||
      action.type.startsWith("searchSweets/")||action.type.startsWith("updateSweet/")||action.type.startsWith("deleteSweet/")
      ||action.type.startsWith("restockSweet/"),
        (state,action:any) => {
          if(action.type.endsWith('/fulfilled'))  state.loading = false;
          else if (action.type.endsWith("/pending")){
            state.loading = true;
            state.error = "";
          }else if(action.type.endsWith("/rejected")){
            state.loading = false;
            state.error=action.payload || "Server error";
          }
      })
  },
});

export default sweetsSlice.reducer;