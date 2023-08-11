import Form from './Form';
import Input from './Input';
import Image from 'next/image';
import useStringHandler, { onCheckExtensions } from '@/hooks/useStringHandler';
import InputsHandlerContext from '@/context/InputsHandlerContext';
import { useContext } from 'react';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];
const DEFAULT_FORM_ERROR = 'Invalid image';

type PerfilImagePropsTypes = HandlerUserStateProps;

export default function PerfilImageForm({
    user,
    isUserStateLoading,
}: PerfilImagePropsTypes) {
    const { handledName } = useStringHandler();
    const { onChangeInput, inputs } = useContext(InputsHandlerContext);

    return (
        <div>
            <h4>Upload image</h4>
            {renderImage()}
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
        </div>
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

    function renderImage() {
        if (isUserStateLoading || !user.userImage) return null;
        return (
            <>
                <Image
                    src={user.userImage}
                    alt="test image"
                    width={200}
                    height={200}
                />
            </>
        );
    }

    async function onSubmitInputs(handledInputs: HandledInputs<typeof inputs>) {
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
