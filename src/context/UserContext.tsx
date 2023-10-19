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
};

const UserContext = createContext<UserContextType>({
    user: {
        username: '',
        userImage: '',
        isUserImageLoading: true,
        setUserImageLoading: () => null,
        setUsername: () => null,
        setUserimage: () => null,
    },
    userState: {
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: () => null,
        setUserStateLoading: () => null,
    },
});

type UserProps = {
    children: JSX.Element;
};

export function UserProvider({ children }: UserProps) {
    const [user, setUser] = useState({
        username: '',
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        isUserImageLoading: false,
        setUserImageLoading: (value: boolean) =>
            setUser((prev) => ({
                ...prev,
                isUserStateLoading: value,
            })),
        setUsername: (value: string) =>
            setUser((prev) => ({ ...prev, username: value })),
        setUserimage: (value: string) =>
            setUser((prev) => ({ ...prev, userImage: value })),
    });
    const [userState, setUserState] = useState({
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: (value: boolean) =>
            setUserState((prev) => ({ ...prev, hasUser: value })),
        setUserStateLoading: (value: boolean) =>
            setUserState((prev) => ({ ...prev, isUserImageLoading: value })),
    });

    const onCheckUserState = useCallback(async () => {
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse: ServerResponse = await response.json();
        setUserState((prev) => ({
            ...prev,
            hasUser: parsedResponse.serverResponse,
            isUserStateLoading: false,
        }));
        if (typeof parsedResponse.body !== 'string') {
            const DBUser = parsedResponse.body as UserType;
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
        <UserContext.Provider value={{ user, userState }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};
