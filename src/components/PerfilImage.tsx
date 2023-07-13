import { useState } from 'react';
import InputsHandler from './InputsHandler';
import Form from './Form';
import Input from './Input';

const EXTENSIONS = ['.jpg', '.png', '.jpeg'];

export default function PerfilImage() {
    const [file] = useState<File | null>(null);

    return (
        <div>
            <h4>Upload image</h4>
            <InputsHandler preInputs={preInputs} inputsAttributes={['files']}>
                <Form onSubmitInputs={onSubmitInputs}>
                    <Input
                        label="image"
                        fieldName="imageInput"
                        inputType="file"
                        inputName="image"
                        inputAccept="image/*"
                    />
                </Form>
            </InputsHandler>
        </div>
    );

    async function onSubmitInputs() {
        if (!file) return;
        const formData = new FormData(); // multipart/form-data format to send to API;
        formData.append('image', file);
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

const preInputs: PreFormInputsType = {
    imageInput: {
        validations: (currentInputValue: string) => [
            {
                coditional: !onCheckExtensions(currentInputValue),
                message: `Allowed extensions: .png, .jpg, .jpeg`,
            },
        ],
        required: true,
    },
};

function onCheckExtensions(text: string) {
    const validate = { value: false };
    EXTENSIONS.forEach((extension) =>
        text.includes(extension) ? (validate.value = true) : null,
    );
    return validate.value;
}
