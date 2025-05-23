import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user:null,
    isAuthenticated:false,
}

const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        loggedIn: (state,action)=>{
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser: (state)=>{
            state.user = null;
            state.isAuthenticated = false;
        }
    }
})

export const {loggedIn,logoutUser} = authSlice.actions;
export default authSlice.reducer;