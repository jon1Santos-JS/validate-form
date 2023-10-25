declare type SetUserType = (user: UserType) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface UserStateType {
    hasUser: boolean;
    isUserStateLoading: boolean;
    setHasUser: (value: boolean) => void;
    setUserStateLoading: (value: boolean) => void;
}

declare interface UserType {
    username: string;
    userImage: string;
    setUsername: (value: string) => void;
    setUserimage: (value: string) => void;
}
