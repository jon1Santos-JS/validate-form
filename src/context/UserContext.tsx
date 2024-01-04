import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

const API = 'api/signIn';

type UserContextType = {
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
    userState: UserStateType;
    setUserState: Dispatch<SetStateAction<UserStateType>>;
    userImageState: UserImageState;
    setUserImageState: Dispatch<SetStateAction<UserImageState>>;
};

export const UserContext = createContext<UserContextType>({
    user: {
        username: '',
        userImage: '',
    },
    setUser: () => null,
    userState: {
        hasUser: false,
        isUserStateLoading: true,
    },
    setUserState: () => null,
    userImageState: {
        isUserImageLoading: false,
    },
    setUserImageState: () => null,
});

type UserProps = {
    children: JSX.Element;
};

export function UserProvider({ children }: UserProps) {
    const [userImageState, setUserImageState] = useState({
        isUserImageLoading: false,
    });
    const [userState, setUserState] = useState({
        hasUser: false,
        isUserStateLoading: true,
    });
    const [user, setUser] = useState({
        username: '',
        userImage: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
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
                setUser,
                userState,
                setUserState,
                userImageState,
                setUserImageState,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};
