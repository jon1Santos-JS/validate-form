import InputsHandler from './InputsHandler';
import Form from './Form';
import Input from './Input';
import _ from 'lodash';
import Image from 'next/image';
import defaultImage from '../../public/uploads/jeipeg.jpg';

const ALLOWED_EXTENSIONS = ['.jpg', '.png', '.jpeg'];
const DEFAULT_FORM_ERROR = 'Invalid image';

export default function PerfilImage() {
    return (
        <div>
            <h4>Upload image</h4>
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
        const response = await fetch('/api/testConnection', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Image uploaded successfully!');
        } else {
            console.error('Error uploading image.');
        }
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
