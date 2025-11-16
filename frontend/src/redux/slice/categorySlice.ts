import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

// category type
export interface categorytype{
  id:number,
  name:string
}

// Slice state
interface categoryState {
  items: categorytype[];
  loading: boolean;
  error: string | null;
}

const initialState: categoryState = {
  items: [],
  loading: false,
  error: "",
};

export const addCategory = createAsyncThunk<{message:string,category:categorytype}, { name: string, token: string }, { rejectValue: string }>(
  "addCategory",
  async ({ name, token },{rejectWithValue}) => {
    try {
      const response = await axios.post(`${SERVER_URL}/api/category`, {name}, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "add failed");
    }
  }
);

export const deleteCategory = createAsyncThunk<{message:string,id:number}, {id:number,token:string},{ rejectValue: string }>(
  "deleteCategory",
  async ({id,token},{rejectWithValue}) => {
    try {
      const response = await axios.delete(`${SERVER_URL}/api/category/${id}`, { headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "delete failed");
    }
  }
);

export const fetchCategory = createAsyncThunk<categorytype[],string,{ rejectValue: string }>(
  "fetchCategory",
  async (token,{rejectWithValue}) => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/category/`,{ headers: { authorization: `Bearer ${token}` } });
      return response.data;
    } catch (e: any) {
      return rejectWithValue(e?.response?.data?.message || "fetch failed");
    }
  }
);


const categorySlice = createSlice({
  name: "categorys",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(addCategory.fulfilled, (state, action) => {
      state.items.push(action.payload.category);
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.items = state.items.filter((s) => s.id !== action.payload?.id);
    })
    .addCase(fetchCategory.fulfilled,(state,action)=>{
        state.items=action.payload;
    })
    .addMatcher((action) => action.type.startsWith("addCategory/")||action.type.startsWith("deleteCategory/"),
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

export default categorySlice.reducer;