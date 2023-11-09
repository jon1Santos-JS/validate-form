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
    isUserImageLoading: boolean;
    setUserImageLoader: (value: boolean) => void;
};

export const UserContext = createContext<UserContextType>({
    user: {
        username: '',
        userImage: '',
        setUsername: () => null,
        setUserimage: () => null,
    },
    userState: {
        hasUser: false,
        isUserStateLoading: true,
        setHasUser: () => null,
        setUserStateLoading: () => null,
    },
    isUserImageLoading: false,
    setUserImageLoader: () => null,
});

type UserProps = {
    children: JSX.Element;
};

export function UserProvider({ children }: UserProps) {
    const [isUserImageLoading, setUserImageLoader] = useState(false);
    const [user, setUser] = useState({
        username: '',
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
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
            setUserState((prev) => ({ ...prev, isUserStateLoading: value })),
    });

    const onCheckUserState = useCallback(async () => {
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse = await response.json();
        setUserState((prev) => ({
            ...prev,
            hasUser: parsedResponse.serverResponse,
            isUserStateLoading: false,
        }));
        if (typeof parsedResponse.body !== 'string') {
            const DBUser: UserType = parsedResponse.body;
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
            value={{ user, userState, isUserImageLoading, setUserImageLoader }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};
