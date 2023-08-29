declare type HasUserType = () => boolean | string;

declare type SetUserType = (user: UserType) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface HandleUserPropsType {
    hasUser: HasUserType;
    setHasUser: (value: boolean) => void;
    user: UserType;
    setUser: SetUserType;
    isUserStateLoading: boolean;
    setUserStateLoading: (value: boolean) => void;
}

declare interface UserType {
    username: string;
    userImage?: string;
}
