import { useState } from 'react';
import Input from '../Input';
import useValidate from '@/hooks/useValidate';
import useString from '@/hooks/useString';
import { useUser } from '../../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';

const API = 'api/updateUserImage';
const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type InputsType = 'imageInput';

export default function PerfilImageForm() {
    const {
        user: { setUserimage },
        setUserImageLoader,
    } = useUser();
    const { validateSingle, validateMany } = useValidate();
    const { handledName, onCheckExtensions } = useString();
    const { inputsFactory } = useInputHandler();
    const [isClickable, handleButtonClick] = useState(true);
    const [inputState, setInputState] = useState({
        imageInput: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        imageInput: inputsFactory({
            validations: (inputAttributes) => [
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
                    message: `Image is required`,
                },
            ],
            required: 'No image uploaded',
            attributes: { value: '', files: null },
            errors: [],
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

    async function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        key: InputsType,
    ) {
        const { value, files } = e.target;
        const input = { ...inputs[key], attribute: { value: value, files } };
        const currentInputs = { ...inputs, [key]: input };
        const validateInput = validateSingle(input, currentInputs);
        setInputs((prev) => ({
            ...prev,
            [key]: validateInput,
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (!isClickable) return;
        if (!validateMany(inputs)) {
            setInputState((prev) => ({
                ...prev,
                imageInput: { ...prev.imageInput, showInputMessage: true },
            }));
            return;
        }
        const inputAttributes = inputs.imageInput.attributes;
        handleButtonClick(false);
        setUserImageLoader(true);
        await onHandleApiResponses(inputAttributes.files as FileList);
        handleButtonClick(true);
    }

    async function onHandleApiResponses(files: FileList) {
        const APIResponse = await onSubmitImageToImageBB(files);
        if (!APIResponse.success) {
            setInputState((prev) => ({
                ...prev,
                imageInput: { ...prev.imageInput, showInputMessage: true },
            }));
            return;
        }
        const imgUrl = APIResponse.data.url;
        const DBResponse = await onSubmitImageToDB(imgUrl);
        if (!DBResponse.success) {
            setInputState((prev) => ({
                ...prev,
                imageInput: { ...prev.imageInput, showInputMessage: true },
            }));
            return;
        }
        setUserimage(imgUrl);
        setInputs((prev) => ({
            ...prev,
            imageInput: { ...prev.imageInput, files: null, value: '' },
        }));
    }

    async function onSubmitImageToImageBB(files: FileList) {
        const file = files[0];
        const fileName = handledName(file.name);
        const formData = new FormData(); // multipart/form-data format to send to API;
        formData.append('image', file, fileName);
        const fetchOptions: FetchOptionsType = {
            method: 'POST',
            body: formData,
        };
        const response = await fetch(
            process.env.NEXT_PUBLIC_IMGBB_API_LINK as string,
            fetchOptions,
        );
        const parsedResponse: ImgBBResponseType = await response.json();
        return parsedResponse;
    }

    async function onSubmitImageToDB(img: string) {
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: img }),
        };
        const response = await fetch(API, options);
        const parsedResponse: DBDefaultResponse = await response.json();
        return parsedResponse;
    }
}
