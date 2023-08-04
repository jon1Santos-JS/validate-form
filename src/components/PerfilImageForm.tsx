import InputsHandler from './InputsHandler';
import Form from './Form';
import Input from './Input';
import _ from 'lodash';
import Image from 'next/image';
import { useState } from 'react';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];
const DEFAULT_FORM_ERROR = 'Invalid image';

type PerfilImagePropsTypes = HandlerUserStateProps;

export default function PerfilImage(props: PerfilImagePropsTypes) {
    const [userImage, setUserImage] = useState(
        process.env.NEXT_PUBLIC_PERFIL_DEFAULT_IMAGE as string,
    );

    return (
        <div>
            <h4>Upload image</h4>
            {renderImage()}
            <InputsHandler preInputs={preInputs}>
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
                        targetProps={['value', 'files']}
                    />
                </Form>
            </InputsHandler>
        </div>
    );

    async function onSubmitInputs(inputs: HandledInputs<typeof preInputs>) {
        if (!inputs.imageInput?.files) return;
        const file = inputs.imageInput?.files[0];
        const fileName = handledName(inputs.imageInput.files[0].name);
        const formData = new FormData(); // multipart/form-data format to send to API;
        formData.append('image', file, fileName);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_IMGBB_API_LINK}&key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
            {
                method: 'POST',
                body: formData,
            },
        );

        if (response.ok) {
            const image = await response.json();
            setUserImage(image.data.url);
        }
    }

    function renderImage() {
        return (
            <>
                <Image
                    src={userImage}
                    alt="test image"
                    width={200}
                    height={200}
                    priority={true}
                />
            </>
        );
    }
}

const preInputs = {
    imageInput: {
        validations: (currentInputValue: string) => [
            {
                coditional: !onCheckExtensions(currentInputValue),
                message: `Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`,
            },
        ],
    },
};

function onCheckExtensions(text: string) {
    const validate = { value: false };
    ALLOWED_EXTENSIONS.forEach((extension) =>
        text.includes(extension) ? (validate.value = true) : null,
    );
    return validate.value;
}

function handledName(name: string) {
    const handledName = _.deburr(name);
    const noCedilha = handledName.replace(/[çÇ]/g, (match) =>
        match === 'ç' ? 'c' : 'C',
    );

    return noCedilha;
}
