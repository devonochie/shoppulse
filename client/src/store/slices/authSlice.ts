import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as authApi from '../../api/services/auth.api';
import { AuthResponse, Credentials, ResetPasswordParams, UserData} from "@/types/auth.types";

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserData>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    const asyncThunkHandler = <T>() => {
      return {
        pending: (state: AuthState) => {
          state.isLoading = true;
          state.error = null;
        },
        fulfilled: (state: AuthState, action: PayloadAction<AuthResponse>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.user = action.payload.user;
        },
        rejected: (state: AuthState, action: PayloadAction<unknown>) => {
          state.isLoading = false;
          state.error = (action.payload as { message: string })?.message || 'Request failed';
        }
      };
    };

    builder
      .addCase(loginUser.pending, asyncThunkHandler<Credentials>().pending)
      .addCase(loginUser.fulfilled, asyncThunkHandler<Credentials>().fulfilled)
      .addCase(loginUser.rejected, asyncThunkHandler<Credentials>().rejected)
      .addCase(registerUser.pending, asyncThunkHandler<UserData>().pending)
      .addCase(registerUser.fulfilled, asyncThunkHandler<UserData>().fulfilled)
      .addCase(registerUser.rejected, asyncThunkHandler<UserData>().rejected)
      .addCase(loadUser.pending, asyncThunkHandler<void>().pending)
      .addCase(loadUser.fulfilled, asyncThunkHandler<void>().fulfilled)
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

// Async Thunks with consistent typing
const createAuthThunk = <T,>(name: string, apiCall: (arg: T) => Promise<AuthResponse>) => {
  return createAsyncThunk<AuthResponse, T, { rejectValue: { message: string } }>(
    `auth/${name}`,
    async (arg, { rejectWithValue }) => {
      try {
        return await apiCall(arg);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return rejectWithValue({
          message: error.response?.data?.message || `${name} failed`
        });
      }
    }
  );
};

export const loginUser = createAuthThunk<Credentials>('login', authApi.login);
export const registerUser = createAuthThunk<UserData>('register', authApi.register);
export const loadUser = createAsyncThunk('auth/me', authApi.me);
export const logoutUser = createAsyncThunk('auth/logout', authApi.logout);
export const forgotUserPassword = createAuthThunk<string>('forgotPassword', authApi.forgotPassword);
export const resetUserPassword = createAuthThunk<ResetPasswordParams>(
  'resetPassword', 
  ({ token, newPassword }) => authApi.resetPassword(token, newPassword)
);

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError, 
  updateProfile 
} = authSlice.actions;

export default authSlice.reducer;