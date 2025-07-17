export interface IUserResponse {
    pkUserId: string;
    strName: string;
    strEmail?: string;
    strPhone?: string;
}

export interface IAuthResponse {
    message: string;
    user: IUserResponse;
}
