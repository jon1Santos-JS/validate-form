import { useState } from 'react';
import Input from '../Input';
import useValidate from '@/hooks/useValidate';
import useString from '@/hooks/useString';
import { useUser } from '../../context/UserContext';
import useInputHandler from '@/hooks/useInputHandler';
import useUtils from '@/hooks/useUtils';

const API = 'api/updateUserImage';
const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type InputsType = 'imageInput';

export default function PerfilImageForm() {
    const { setUser, setUserImageState } = useUser();
    const { validateSingleSync, validateMany } = useValidate();
    const { handledName, onCheckExtensions } = useString();
    const { onSetTimeOut } = useUtils();
    const { inputsFactory } = useInputHandler();
    const [isRequesting, setRequestState] = useState(false);
    const [inputState, setInputState] = useState({
        imageInput: { showInputMessage: false, highlightInput: false },
    });
    const [inputs, setInputs] = useState<InputsToValidateType<InputsType>>({
        imageInput: inputsFactory({
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
                                onClick: (e) => {
                                    if (isRequesting) e.preventDefault();
                                },
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
        if (isRequesting) return;
        setInputs((prev) => ({
            ...prev,
            [key]: validateSingleSync(
                {
                    ...prev[key],
                    attributes: {
                        value: e.target.value,
                        files: e.target.files,
                    },
                },
                prev,
            ),
        }));
    }

    async function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        if (isRequesting) return;
        if (!validateMany(inputs)) {
            setInputState((prev) => ({
                ...prev,
                imageInput: { ...prev.imageInput, showInputMessage: true },
            }));
            onSetTimeOut(() => {
                setInputState((prev) => ({
                    ...prev,
                    imageInput: { ...prev.imageInput, showInputMessage: false },
                }));
            }, 2750);
            return;
        }
        setRequestState(true);
        setUserImageState((prev) => ({ ...prev, isUserImageLoading: true }));
        const response = await onHandleApiResponses(
            inputs.imageInput.attributes.files as FileList,
        );
        setRequestState(false);
        if (!response.success) {
            setInputState((prev) => ({
                ...prev,
                imageInput: { ...prev.imageInput, showInputMessage: true },
            }));
            return;
        }
        setInputs((prev) => ({
            ...prev,
            imageInput: {
                ...prev.imageInput,
                attributes: { value: '', files: null },
            },
        }));
        setUser((prev) => ({ ...prev, userImage: response.data.value }));
    }

    async function onHandleApiResponses(files: FileList) {
        const APIResponse = await onSubmitImageToImageBB(files);
        if (!APIResponse.success) return APIResponse;
        const DBResponse = await onSubmitImageToDB(APIResponse.data.url);
        return DBResponse;
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
        const parsedResponse: DBUpdateUserImageResponse = await response.json();
        return parsedResponse;
    }
}
