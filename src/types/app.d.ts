declare type HasUserType = () => boolean | string;

declare type SetUserType = (user: string) => void;

declare type IsUserStateLoadingType = () => boolean | undefined;

declare interface HandlerUserStateProps {
    hasUser: HasUserType;
    setHasUser: (value: boolean) => void;
    user: string;
    setUser: SetUserType;
    isUserStateLoading: () => boolean;
}
