import Form from '../Form';
import Input from '../Input';
import useStringHandler, { onCheckExtensions } from '@/hooks/useStringHandler';
import InputsHandlerContext from '@/context/InputsHandlerContext';
import { useContext } from 'react';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];
const DEFAULT_FORM_ERROR = 'Invalid image';

type PerfilImageFormPropsTypes = HandlerUserStateProps;

export default function PerfilImageForm({ user }: PerfilImageFormPropsTypes) {
    const { handledName } = useStringHandler();
    const { onChangeInput } = useContext(InputsHandlerContext);

    return (
        <>
            <h4>Upload image</h4>
            <Form
                onSubmitInputs={onSubmitInputs}
                formDefaultError={DEFAULT_FORM_ERROR}
            >
                <Input
                    label="image"
                    objectifiedName="imageInput"
                    inputType="file"
                    inputName="image"
                    inputAccept="image/*"
                    onChange={onChangeImage}
                />
            </Form>
        </>
    );

    function onChangeImage(e: React.ChangeEvent<HTMLInputElement>) {
        onChangeInput({
            objectifiedName: 'imageInput',
            targetProp: 'value',
            value: e.target.value,
        });

        onChangeInput({
            objectifiedName: 'imageInput',
            targetProp: 'files',
            value: e.target.files,
        });
    }
    async function onSubmitInputs(
        handledInputs: FormInputsTypeToSubmit<
            keyof typeof PERFIL_IMAGE_FORM_INPUTS_STATE
        >,
    ) {
        if (!handledInputs.imageInput?.files) return;
        const file = handledInputs.imageInput?.files[0];
        const fileName = handledName(handledInputs.imageInput.files[0].name);
        const formData = new FormData(); // multipart/form-data format to send to API;
        formData.append('image', file, fileName);
        const fetchOptions: FetchOptionsType = {
            method: 'POST',
            body: formData,
        };
        const imgApiResponse = await fetch(
            `${process.env.NEXT_PUBLIC_IMGBB_API as string}expiration=600&key=${
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

export const PERFIL_IMAGE_FORM_INPUTS_STATE = {
    imageInput: {
        validations: (currentInputValue: string) => [
            {
                coditional: !onCheckExtensions(
                    ALLOWED_EXTENSIONS,
                    currentInputValue,
                ),
                message: `Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
            },
        ],
    },
};
