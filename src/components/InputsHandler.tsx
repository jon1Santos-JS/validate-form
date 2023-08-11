import { useState } from 'react';
import InputHandlerContext from '@/context/InputHandlerContext';
import { Lodash } from '@/lib/lodashAdapter';

interface InputHandlerPropsTypes {
    preInputs: PreFormInputsType;
    children: JSX.Element[] | JSX.Element;
}

const INPUTS_FIELDS_TO_OMIT = ['required', 'validations', 'errors'];

export default function InputsHandler({
    preInputs,
    children,
}: InputHandlerPropsTypes) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);

    return (
        <InputHandlerContext.Provider
            value={{
                showInputMessagesFromOutside,
                inputs,
                onChangeInput,
                updateInputsToSubmit,
                setShowInputsMessage,
            }}
        >
            {children}
        </InputHandlerContext.Provider>
    );

    function onChangeInput({
        objectifiedName,
        targetProps,
        value,
    }: onChangeInputsProps) {
        setInputs((prevInputs) => {
            // GETTING THE OBJECT  WITH THE NEWPROP ADDED INTO THE SPECIFIC FIELD (objectifiedName)
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [targetProps]: value,
            };
            // RETURNED ALL INPUTS WITH THE SPECIFIC FIELD UPTATED
            return {
                ...prevInputs,
                [objectifiedName]: updatedInput,
            };
        });
    }

    function updateInputsToSubmit() {
        return onOmitFormInputsFields(inputs);
    }

    function setShowInputsMessage(value: boolean) {
        setShowInputMessages(value);
    }
}

// AUXILIARY FUNCTIONS

function onAddFormInputsFields(inputs: PreFormInputsType) {
    const handledInputs = onAddRequiredInputs();

    function onAddRequiredInputs() {
        for (const i in inputs) {
            inputs[i].errors = [];
            inputs[i].value = '';
        }
        return inputs;
    }

    return handledInputs as FormInputsType;
}

function onOmitFormInputsFields(preInputs: PreFormInputsType) {
    const mainFieldsToOmit = Object.keys(preInputs).filter((key) =>
        key.includes('confirm'),
    );
    const secondaryFieldsToOmit = INPUTS_FIELDS_TO_OMIT;
    const handledInputs: unknown = Lodash.onOmitFields(
        preInputs,
        mainFieldsToOmit,
        secondaryFieldsToOmit,
    );
    return handledInputs as FormInputsTypeToSubmit;
}
