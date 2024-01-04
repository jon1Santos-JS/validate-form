declare type SetUserType = (user: UserType) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface UserStateType {
    hasUser: boolean;
    isUserStateLoading: boolean;
}

declare interface UserType {
    username: string;
    userImage: string;
}

declare interface UserImageState {
    isUserImageLoading: boolean;
}
