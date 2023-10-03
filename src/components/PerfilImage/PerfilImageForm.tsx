import { useState } from 'react';
import Form, { ElementsToAddProps } from '../Form';
import Input from '../Input';
import { handledName, onCheckExtensions } from '@/hooks/useInputsHandler';

const API = 'api/changeUserImg';
const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type PerfilImageFormProps = {
    handleUserProps: HandleUserPropsType;
};

export default function PerfilImageForm({
    handleUserProps,
}: PerfilImageFormProps) {
    const { user } = handleUserProps;
    const [ShowInputsMessage, setShowInputsMessage] = useState(false);
    const [inputs, setInputs] = useState({
        imageInput: {
            validations: (currentInputValue: string) => [
                {
                    coditional: !onCheckExtensions(
                        ALLOWED_EXTENSIONS,
                        currentInputValue,
                    ),
                    message: `Allowed extensions: ${ALLOWED_EXTENSIONS.join(
                        ', ',
                    )}`,
                },
            ],
            required: 'No image loaded',
            value: '',
            errors: [],
            files: null as FileList | null,
        },
    });

    return (
        <>
            <h4>Upload image</h4>
            <Form
                ownProps={{
                    onSubmitInputs: onSubmitInputs,
                    formError: null,
                    elementsToAdd: elementsToAddFn,
                    className: 'o-perfil-image-form',
                }}
                validateProps={{
                    inputs,
                    onShowInputsMessage,
                }}
            >
                <Input
                    ownProps={{
                        label: 'image',
                        inputType: 'file',
                        inputAccept: 'image/*',
                        onChange: (e) => onChange(e, 'imageInput'),
                    }}
                    validateProps={{
                        input: inputs.imageInput,
                        showInputMessagesFromOutside: ShowInputsMessage,
                        inputs,
                    }}
                />
            </Form>
        </>
    );

    function onChange(
        e: React.ChangeEvent<HTMLInputElement>,
        name: keyof typeof inputs,
    ) {
        setInputs((prev) => ({
            ...prev,
            [name]: {
                ...prev[name],
                value: e.target.value,
                files: e.target.files,
            },
        }));
    }

    function onShowInputsMessage(value: boolean) {
        setShowInputsMessage(value);
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
        // IMAGE LOCAL API
        await onUpdateUserImageDB(image.data.url);
        window.location.reload();
    }

    async function onUpdateUserImageDB(img: string) {
        const handledUser = {
            userName: user.username,
            userImg: img,
        };
        const options: FetchOptionsType = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(handledUser),
        };
        await fetch(API, options);
    }

    function elementsToAddFn(props: ElementsToAddProps) {
        return (
            <div>
                <button
                    key={'submitButton'}
                    className="c-button"
                    onClick={props.onClick}
                >
                    Submit
                </button>
            </div>
        );
    }
}
