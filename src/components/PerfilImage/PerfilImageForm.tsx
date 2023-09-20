import { useState } from 'react';
import Form from '../Form';
import Input from '../Input';
import useStringHandler, { onCheckExtensions } from '@/hooks/useInputsHandler';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

type PerfilImageFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
};

export default function PerfilImageForm({
    handleUserProps,
}: PerfilImageFormPropsTypes) {
    const { user } = handleUserProps;
    const { handledName } = useStringHandler();
    const [areValid, setAreValid] = useState(false);
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
                }}
                validateProps={{
                    inputs,
                    setShowInputsMessage,
                }}
            >
                <Input
                    ownProps={{
                        label: 'image',
                        inputType: 'file',
                        inputName: 'image',
                        inputAccept: 'image/*',
                        onChange: (e) => onChange(e, 'imageInput'),
                    }}
                    validateProps={{
                        input: inputs.imageInput,
                        showInputMessagesFromOutside: areValid,
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

    function setShowInputsMessage(value: boolean) {
        setAreValid(value);
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
        const imgApiResponse = await fetch(
            `${
                process.env.NEXT_PUBLIC_IMGBB_API_LINK as string
            }expiration=600&key=${
                process.env.NEXT_PUBLIC_IMGBB_API_KEY as string
            }`,
            fetchOptions,
        );
        if (!imgApiResponse.ok) return;
        const image = await imgApiResponse.json();
        onUpdateUserImageDB(image.data.url);
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
        await fetch(
            process.env.NEXT_PUBLIC_CHANGE_USER_IMG_LINK as string,
            options,
        );
    }
}
