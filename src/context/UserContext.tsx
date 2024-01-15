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
};

export const UserContext = createContext<UserContextType>({
    user: {
        username: '',
    },
    setUser: () => null,
    userState: {
        hasUser: false,
        isLoading: true,
    },
    setUserState: () => null,
});

type UserProps = {
    children: JSX.Element;
};

export function UserProvider({ children }: UserProps) {
    const [userState, setUserState] = useState({
        hasUser: false,
        isLoading: true,
    });
    const [user, setUser] = useState({
        username: '',
    });

    const onCheckUserState = useCallback(async () => {
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse: AuthUserResponse = await response.json();
        setUserState((prev) => ({
            ...prev,
            hasUser: parsedResponse.success,
            isLoading: false,
        }));
        if (parsedResponse.success) {
            const DBUser = parsedResponse.data.username;
            setUser((prev) => ({
                ...prev,
                username: DBUser,
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(UserContext);
};
