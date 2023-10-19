import { useState } from 'react';
import Input from '../Input';
import useValidate from '@/hooks/useValidate';
import useString from '@/hooks/useString';
import { useUser } from '../../context/UserContext';

const API = 'api/changeUserImg';
const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type InputsType = 'imageInput';

export default function PerfilImageForm() {
    const {
        user: { username, setUserimage, setUserImageLoading },
    } = useUser();
    const { uniqueValidation, manyValidation } = useValidate();
    const { handledName, onCheckExtensions } = useString();
    const [isButtonClickable, setClickableButton] = useState(true);
    const [inputState, setInputState] = useState({
        imageInput: {
            showInputMessage: false,
            highlightInput: false,
            onShowInputMessage: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    imageInput: { ...prev.imageInput, showInputMessage: value },
                })),
            onHighlightInput: (value: boolean) =>
                setInputState((prev) => ({
                    ...prev,
                    imageInput: { ...prev.imageInput, highlightInput: value },
                })),
        },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        imageInput: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !onCheckExtensions(
                        ALLOWED_EXTENSIONS,
                        currentInputValue,
                    ),
                    message: `Supported extensions: ${ALLOWED_EXTENSIONS.join(
                        ', ',
                    )}`,
                },
            ],
            required: 'No image uploaded',
            value: '',
            errors: [],
            files: null,
        },
    });

    return (
        <>
            <h4>Upload image</h4>
            <form className="o-perfil-image-form">
                <fieldset className="container">
                    <div className="inputs">
                        <Input
                            ownProps={{
                                label: 'image',
                                inputType: 'file',
                                inputAccept: 'image/*',
                                onChange: (e) => onChange(e, 'imageInput'),
                            }}
                            inputStateProps={{
                                input: inputs.imageInput,
                                inputState: inputState.imageInput,
                            }}
                            formProps={{
                                hasError: false,
                            }}
                        />
                    </div>
                    <div>
                        <button
                            key={'submitButton'}
                            className="c-button"
                            onClick={onClick}
                        >
                            Submit
                        </button>
                    </div>
                </fieldset>
            </form>
        </>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: e.target.value,
                files: e.target.files,
            },
        }));
        setInputs((prev) => ({
            ...prev,
            [key]: uniqueValidation({ ...prev[key] }),
        }));
        inputState.imageInput.onHighlightInput(false);
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (manyValidation(inputs)) {
            if (!isButtonClickable) return;
            setUserImageLoading(true);
            await onSubmitInputs();
            setClickableButton(false);
        }
        inputState.imageInput.onShowInputMessage(true);
        setClickableButton(true);
    }

    async function onSubmitInputs() {
        if (!inputs.imageInput.files) return;
        const file = inputs.imageInput.files[0];
        const fileName = handledName(file.name);
        const formData = new FormData(); // multipart/form-data format to send to API;
        formData.append('image', file, fileName);
        const fetchOptions: FetchOptionsType = {
            method: 'POST',
            body: formData,
        };
        // IMAGE THIRTY PARTY API
        const imgApiResponse = await fetch(
            process.env.NEXT_PUBLIC_IMGBB_API_LINK as string,
            fetchOptions,
        );
        if (!imgApiResponse.ok) return;
        const image = await imgApiResponse.json();
        setUserimage(image.data.url);
        setUserImageLoading(false);
        // IMAGE LOCAL API
        await onUpdateUserImageDB(image.data.url);
        inputState.imageInput.onShowInputMessage(true);
    }

    async function onUpdateUserImageDB(img: string) {
        const handledUser = {
            userName: username,
            userImg: img,
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledUser),
        };
        await fetch(API, options);
    }
}
