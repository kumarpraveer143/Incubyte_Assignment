import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
const SERVER_URL=import.meta.env.VITE_SERVER_URL;

// thunkAPI is 2nd argument here that have rejectWithValue for send custom error to .rejected case in reducers.
export const registerUser=createAsyncThunk<any,{name:string,email:string,password:string},{rejectValue:string}>(
    'registerUser',
    async(userData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${SERVER_URL}/api/auth/register`,userData);
            localStorage.setItem('authorization',"Bearer "+response.data.token);
            return response.data;
        }catch(e:any){
            return rejectWithValue(e?.response?.data?.message || "registration failed");
        }
    }
)

export const loginUser=createAsyncThunk<any,{email:string,password:string},{rejectValue:string}>(
    'loginUser',
    async(userData,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${SERVER_URL}/api/auth/login`,userData);
            localStorage.setItem('authorization',"Bearer "+response.data.token);
            return response.data;
        }catch(e:any){
            return rejectWithValue(e?.response?.data?.message || "Login failed");
        }
})


export const verifyUser=createAsyncThunk<any,string,{rejectValue:string}>(
    'verifyUser',
    async(authorization,{rejectWithValue})=>{
        try{
            const response=await axios.post(`${SERVER_URL}/api/auth/verifyJWT`,{},{headers:{authorization}});
            localStorage.setItem('authorization',"Bearer "+response.data.token);
            return response.data;
        }catch(e:any){
            return rejectWithValue(e?.response?.data?.message || "Login failed");
        }
})


type user={
    name:string,
    email:string,
    role:string
}

type response={
    message:string,
    user:user,
    token:string
}

type userInfostate={
    userInfo:response,
    loading:boolean,
    error:string
}

const userInfoInitialState:userInfostate={
    userInfo:{message:"",user:{name:"",email:"",role:""},token:""},
    loading:false,
    error:""
}


const userInfoSlice=createSlice({
    name:"userInfoSlice",
    initialState:userInfoInitialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(registerUser.fulfilled,(state,action)=>{
            state.userInfo=action.payload;
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.userInfo=action.payload;
        })
        .addCase(verifyUser.fulfilled,(state,action)=>{
            state.userInfo=action.payload;
        })
        // instead of seprate 6 cases added all in one
        .addMatcher((action)=>action.type.startsWith('registerUser/') || action.type.startsWith('loginUser/')
        || action.type.startsWith('verifyUser/') ,(state,action:any)=>{
            if(action.type.endsWith('/fulfilled'))
                state.loading=false;
            else if(action.type.endsWith('/pending')){
                state.loading=true;
                state.error='';
            }else if(action.type.endsWith('/rejected')){
                state.loading=false;
                state.error=action.payload || "Server error";
            }
        })
    }
})

export default userInfoSlice.reducer;