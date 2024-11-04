import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Http_request from "./hooks/http_request";

export const requestBalance = createAsyncThunk(
  'requestBalance/fetchBalance',
  async (_, { rejectWithValue }) => {
    let userId = JSON.parse(localStorage.getItem('user'));

    try {
      if (userId.id) {
        const res = await Http_request()('get', `/users?id=${userId.id}`);
        if (res.status >= 200 && res.status < 300) {
          return res.data;
        } else {
          return rejectWithValue('Ошибка при получении данных');
        }
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const requestBalanceSlice = createSlice({
  name: "requestBalance",
  initialState: { value: [], status: 'idle', error: null },
  
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(requestBalance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(requestBalance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(requestBalance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});


const modalSlice = createSlice({

  name : 'modalWindow',
  initialState : {value : false},
  reducers : {

    setModalValue : (state, action) => {state.value = action.payload}
  }
  
})

const openAside = createSlice({

  name : 'openAside',
  initialState : {value : false},
  reducers : {

    setAside : (state, action) => {state.value = action.payload}
  }
  
})

export const {setModalValue} = modalSlice.actions
export const {setAside} = openAside.actions

export const store = configureStore({
  reducer: {
    requestBalance: requestBalanceSlice.reducer,
    modalWindow : modalSlice.reducer,
    openAside : openAside.reducer
  }
});
