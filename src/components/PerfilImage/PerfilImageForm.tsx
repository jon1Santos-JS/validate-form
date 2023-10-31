import { useState } from 'react';
import Input from '../Input';
import useValidate from '@/hooks/useValidate';
import useString from '@/hooks/useString';
import { useUser } from '../../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';

const API = 'api/changeUserImg';
const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type InputsType = 'imageInput';

export default function PerfilImageForm() {
    const {
        user: { username, setUserimage },
        onLoadUserImage,
    } = useUser();
    const { validateSingle, validateMany } = useValidate();
    const { handledName, onCheckExtensions } = useString();
    const { inputsFactory, inputStateFactory } = useInputHandler();
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        imageInput: inputStateFactory({
            onShowInputMessage,
            onHighlightInput,
        }),
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        imageInput: inputsFactory({
            validations: (currentInputValue: string) => [
                {
                    conditional: !onCheckExtensions(
                        ALLOWED_EXTENSIONS,
                        currentInputValue,
                    ),
                    message: `Supported extensions: ${ALLOWED_EXTENSIONS.join(
                        ', ',
                    )}`,
                },
            ],
            required: 'No image uploaded',
            files: null,
        }),
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
            [key]: validateSingle({ ...prev[key] }),
        }));
        setInputState((prev) => ({
            ...prev,
            imageInput: { ...prev.imageInput, highlightInput: false },
        }));
    }

    function onShowInputMessage(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                showInputMessage: value,
            },
        }));
    }

    function onHighlightInput(value: boolean, key: InputsType) {
        setInputState((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                highlightInput: value,
            },
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            inputState.imageInput.onShowInputMessage(true, 'imageInput');
            return;
        }
        handleButtonClick(false);
        onLoadUserImage(true);
        const response = await onSubmitInputs();
        if (response) setUserimage(response);
        setInputs((prev) => ({
            ...prev,
            imageInput: { ...prev.imageInput, files: null, value: '' },
        }));
        handleButtonClick(true);
    }
    // IMAGE THIRTY PARTY API
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
        const imgApiResponse = await fetch(
            process.env.NEXT_PUBLIC_IMGBB_API_LINK as string,
            fetchOptions,
        );
        if (!imgApiResponse.ok) return;
        const image: ImgBBResponseType = await imgApiResponse.json();
        await onUpdateUserImageDB(image.data.url);
        setInputState((prev) => ({
            ...prev,
            imageInput: { ...prev.imageInput, showInputMessage: true },
        }));
        return image.data.url;
    }
    // IMAGE LOCAL API
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
