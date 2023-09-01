declare type SetUserType = (user: UserType) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface HandleUserPropsType {
    user: UserType;
    hasUser: boolean;
    isUserStateLoading: boolean;
    setHasUser: (value: boolean) => void;
    setUser: SetUserType;
    setUserStateLoading: (value: boolean) => void;
}

declare interface UserType {
    username: string;
    userImage?: string;
}
