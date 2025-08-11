type UserRole =  "admin" | "user" |  "moderator"

export interface Credentials  {
    email: string
    password: string
}

export interface UserData extends Omit<Credentials, 'password'> {
    id?: string
    username?: string;
    role?: UserRole
    avatar?: string;
    password?: string
}


export interface AuthResponse {
    token?: string;
    user?: {
        id: string
        email: string
        username?: string
    }
    message?: string
}

export interface ResetPasswordParams {
    token?: string
    newPassword: string
}