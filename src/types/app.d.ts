declare type UserType = string | undefined;

declare type HasUserType = () => boolean | string;

declare type SetUserType = (user: string | undefined) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface HandlerUserStateProps {
    hasUser: HasUserType;
    setHasUser: (value: boolean) => void;
    user: UserType;
    setUser: SetUserType;
    isUserStateLoading: () => boolean;
}
