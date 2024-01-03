import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

const API = 'api/signIn';

type UserContextType = {
    user: UserType;
    userState: UserStateType;

    userImageState: UserImageState;
};

export const UserContext = createContext<UserContextType>({
    user: {
        username: '',
        userImage: '',
        setUsername: () => null,
        setUserImage: () => null,
    },
    userState: {
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: () => null,
        setUserStateLoading: () => null,
    },
    userImageState: {
        isUserImageLoading: false,
        onLoadingUserImage: () => null,
    },
});

type UserProps = {
    children: JSX.Element;
};

export function UserProvider({ children }: UserProps) {
    const [user, setUser] = useState({
        username: '',
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        setUsername: (value: string) =>
            setUser((prev) => ({ ...prev, username: value })),
        setUserImage: (value: string) =>
            setUser((prev) => ({ ...prev, userImage: value })),
    });
    const [userImageState, setUserImageState] = useState({
        isUserImageLoading: false,
        onLoadingUserImage: (value: boolean) =>
            setUserImageState((prev) => ({
                ...prev,
                isUserImageLoading: value,
            })),
    });
    const [userState, setUserState] = useState({
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: (value: boolean) =>
            setUserState((prev) => ({ ...prev, hasUser: value })),
        setUserStateLoading: (value: boolean) =>
            setUserState((prev) => ({ ...prev, isUserStateLoading: value })),
    });

    const onCheckUserState = useCallback(async () => {
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse: AuthUserResponse = await response.json();
        setUserState((prev) => ({
            ...prev,
            hasUser: parsedResponse.success,
            isUserStateLoading: false,
        }));
        if (parsedResponse.success) {
            const DBUser = parsedResponse.data;
            setUser((prev) => ({
                ...prev,
                ...DBUser,
            }));
        }
    }, []);

    useEffect(() => {
        onCheckUserState();
    }, [onCheckUserState]);

    return (
        <UserContext.Provider
            value={{
                user,
                userState,
                userImageState,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};
