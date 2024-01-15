import useInputHandler from '@/hooks/useInputHandler';
import useString from '@/hooks/useString';
import {
    Dispatch,
    SetStateAction,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

const API = 'api/signIn';

export type PerfilImageInputsType = 'imageInput';

type InputStateType = {
    showInputMessage: boolean;
    highlightInput: boolean;
};

type ImageType = {
    preview: string;
    production: string;
};

type ImageStateType = {
    preview: { isLoading: boolean };
    production: { isLoading: boolean };
};

type ImageModalState = {
    isOpen: boolean;
};

type PerfilImageContextType = {
    image: ImageType;
    setImage: Dispatch<SetStateAction<ImageType>>;
    imageState: ImageStateType;
    setImageState: Dispatch<SetStateAction<ImageStateType>>;
    imageInput: ValidateInputType<PerfilImageInputsType, PerfilImageInputsType>;
    setImageInput: Dispatch<
        SetStateAction<
            ValidateInputType<PerfilImageInputsType, PerfilImageInputsType>
        >
    >;
    imageInputState: InputStateType;
    setImageInputState: Dispatch<SetStateAction<InputStateType>>;
    imageModalState: ImageModalState;
    setImageModalState: Dispatch<SetStateAction<ImageModalState>>;
};

export const PerfilImageContext = createContext<PerfilImageContextType>({
    image: {
        preview: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        production: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    },
    setImage: () => null,
    imageState: {
        preview: { isLoading: false },
        production: { isLoading: false },
    },
    setImageState: () => null,
    imageInput: { errors: [], attributes: { value: '' } },
    setImageInput: () => null,
    imageInputState: { showInputMessage: false, highlightInput: false },
    setImageInputState: () => null,
    imageModalState: { isOpen: false },
    setImageModalState: () => null,
});

type UserProps = {
    children: JSX.Element;
};

export function PerfilImageProvider({ children }: UserProps) {
    const { inputsFactory } = useInputHandler();
    const { onCheckExtensions } = useString();
    const [image, setImage] = useState({
        preview: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
        production: process.env.NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
    });
    const [imageState, setImageState] = useState({
        preview: { isLoading: true },
        production: { isLoading: true },
    });
    const [imageInputState, setImageInputState] = useState({
        showInputMessage: false,
        highlightInput: false,
    });
    const [imageModalState, setImageModalState] = useState({ isOpen: false });
    const [imageInput, setImageInput] = useState<
        ValidateInputType<PerfilImageInputsType, PerfilImageInputsType>
    >(
        inputsFactory({
            validationsSync: (inputAttributes) => [
                {
                    conditional: !onCheckExtensions(
                        ALLOWED_EXTENSIONS,
                        inputAttributes.value,
                    ),
                    message: `Supported extensions: ${ALLOWED_EXTENSIONS.join(
                        ', ',
                    )}`,
                },
                {
                    conditional: !inputAttributes.files,
                    message: `No image uploaded`,
                },
            ],
            required: { value: true, message: 'No image uploaded' },
            attributes: { value: '' },
            errors: [],
        }),
    );

    const onCheckUserImageState = useCallback(async () => {
        setImageState((prev) => ({
            ...prev,
            production: { isLoading: true },
        }));
        const response = await fetch(API, {
            method: 'GET',
        });
        const parsedResponse: AuthUserResponse = await response.json();

        if (parsedResponse.success) {
            const DBUserImage = parsedResponse.data.userImage;
            setImage((prev) => ({
                ...prev,
                production: DBUserImage,
                preview: process.env
                    .NEXT_PUBLIC_USER_PERFIL_DEFAULT_IMG as string,
            }));
            setImageState((prev) => ({
                ...prev,
                production: { isLoading: false },
            }));
        }
    }, []);

    useEffect(() => {
        onCheckUserImageState();
    }, [onCheckUserImageState]);

    return (
        <PerfilImageContext.Provider
            value={{
                image,
                setImage,
                imageState,
                setImageState: setImageState as Dispatch<
                    SetStateAction<ImageStateType>
                >,
                imageInput,
                setImageInput: setImageInput as Dispatch<
                    SetStateAction<
                        ValidateInputType<
                            PerfilImageInputsType,
                            PerfilImageInputsType
                        >
                    >
                >,
                imageInputState,
                setImageInputState: setImageInputState as Dispatch<
                    SetStateAction<InputStateType>
                >,
                imageModalState,
                setImageModalState,
            }}
        >
            {children}
        </PerfilImageContext.Provider>
    );
}

export const useImage = () => {
    return useContext(PerfilImageContext);
};
