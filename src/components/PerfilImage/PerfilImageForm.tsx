import Form from '../Form';
import Input from '../Input';
import useStringHandler, { onCheckExtensions } from '@/hooks/useStringHandler';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];
const DEFAULT_ERROR_MESSAGE = 'Invalid image';

type PerfilImageFormPropsTypes = {
    handleUserProps: HandleUserPropsType;
    handleInputsProps: HandleInputsPropsType<PerfilFormInputs>;
};
type PerfilFormInputs = 'imageInput';

export default function PerfilImageForm({
    handleUserProps,
    handleInputsProps,
}: PerfilImageFormPropsTypes) {
    const { user } = handleUserProps;
    const { handledName } = useStringHandler();
    const { onChangeInput } = handleInputsProps;

    return (
        <>
            <h4>Upload image</h4>
            <Form
                ownProps={{
                    onSubmitInputs: onSubmitInputs,
                    formDefaultError: DEFAULT_ERROR_MESSAGE,
                }}
                handleInputsProps={handleInputsProps}
            >
                <Input
                    ownProps={{
                        label: 'image',
                        inputType: 'file',
                        inputName: 'image',
                        inputAccept: 'image/*',
                        onChange: onChangeImage,
                        objectifiedName: 'imageInput',
                    }}
                    handleInputsProps={handleInputsProps}
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
        handledInputs: FormHandledInputsType<PerfilFormInputs>,
    ) {
        const file = handledInputs.imageInput.files[0];
        const fileName = handledName(handledInputs.imageInput.files[0].name);
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

export const PERFIL_IMAGE_FORM_INPUTS_STATE: PreFormInputsType<PerfilFormInputs> =
    {
        imageInput: {
            validations: (currentInputValue) => [
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
        },
    };
