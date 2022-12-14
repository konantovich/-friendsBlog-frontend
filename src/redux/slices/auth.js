
//reducer === slice in reduxjs/toolkit
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit"; //for async actions
import axios from "../../axios"; 


export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    
    return data 
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me'); //axios auto return token from localStorage and send it(create middleWare in axios.js and all request axios create Autorization)
    
    return data  
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params); 

    return data  
})


export const fetchGoogleAuthOrRegister= createAsyncThunk('auth/googleauth', async (params) => {
    const { data } = await axios.post('/auth/googleauth', params); 

    return data  
})

const initialState = {
    data: null, //user info
    status: 'loading',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => { 
            state.data = null
            
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => { 
            state.status = 'loading' 
            state.data = null;

        },
        [fetchAuth.fulfilled]: (state, action) => { 
            state.data = action.payload 
            state.status = 'loaded' 
        },
        [fetchAuth.rejected]: (state) => { 
            state.items = null
            state.status = 'error'
        },
        [fetchAuthMe.pending]: (state) => { 
            state.status = 'loading'
            state.data = null;

        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.data = action.payload
            state.status = 'loaded' 
        },
        [fetchAuthMe.rejected]: (state) => { 
            state.items = null 
            state.status = 'error'
        },
        [fetchRegister.pending]: (state) => { 
            state.status = 'loading' 
            state.data = null;

        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.data = action.payload
            state.status = 'loaded'
        },
        [fetchRegister.rejected]: (state) => { 
            state.items = null 
            state.status = 'error' 
        },

        [fetchGoogleAuthOrRegister.pending]: (state) => { 
            state.status = 'loading' 
            state.data = null;

        },
        [fetchGoogleAuthOrRegister.fulfilled]: (state, action) => {
            state.data = action.payload
            state.status = 'loaded'
        },
        [fetchGoogleAuthOrRegister.rejected]: (state) => { 
            state.items = null 
            state.status = 'error' 
        },
    
    }
})


export const selectIsAuth = state => Boolean(state.auth.data) //check have login or not

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;