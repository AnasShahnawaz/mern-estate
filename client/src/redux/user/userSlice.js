import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    message: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signInMessage: (state, action) => {
            state.loading = false;
            state.message = action.payload;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
        },
        updateUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signOutUserStart: (state, action) => {
            state.loading = true;
        },
        signOutUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
        },
        signOutUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state, action) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = null;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        }
    }
});

export const {
    signInStart,
    signInMessage,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
} = userSlice.actions;
export default userSlice.reducer;