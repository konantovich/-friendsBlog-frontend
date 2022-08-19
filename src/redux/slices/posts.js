
//reducer === slice in reduxjs/toolkit
import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts"); 
  return data;
});


export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags"); 
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => axios.delete(`/posts/${id}`) 
);


export const fetchAddComment = createAsyncThunk(
  "posts/fetchAddComment",
  async (obj) => {

    console.log('fetchAddComment',obj.id, obj.userData, obj.text)
    const { data } = await axios.patch(`/comment/${obj.id}`, {'user': obj.userData, 'text' : obj.text}) 
    
    return data
});



const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {

    //if need post sort date/populare in reducer. Now sort in backend
    // postsSortsDate: (state) => {

    //      state.posts.items = state.posts.items.sort((newDate, lastDate) => { 
    //     return (
    //       Math.floor(new Date(lastDate.updatedAt).getTime() / 1000) -
    //       Math.floor(new Date(newDate.updatedAt).getTime() / 1000)
    //     );
    //   }) 
    // },
    // postsSortsPopulare: (state) => {
    //     state.posts.items = state.posts.items.sort((lowPopular,topPopulare ) => topPopulare.viewsCount - lowPopular.viewsCount)
    // },
  },
  extraReducers: {
    //get all posts
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading"; 
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded"; 
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error"; 
    },
    //get all tags
    [fetchTags.pending]: (state) => {
      state.tags.items = []; 
      state.tags.status = "loading"; 
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded"; 
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = []; //то передадим пустой массив
      state.tags.status = "error"; //то статус error (error)
    },
    //remove posts
    [fetchRemovePost.pending]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      ); 
    }, 

    //add comment
    [fetchAddComment.pending]: (state, action) => {
        state.posts.status = "loading"; 
      },
      [fetchAddComment.fulfilled]: (state, action) => {
        state.posts.status = "loaded";
      },
      [fetchAddComment.rejected]: (state) => {
        state.posts.status = "error";
    },
  },
});

export const postsReducer = postsSlice.reducer;

//export const { postsSortsDate, postsSortsPopulare } = postsSlice.actions;
