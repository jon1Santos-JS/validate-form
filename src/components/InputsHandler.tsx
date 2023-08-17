import { useState } from 'react';
import InputsHandledContext from '@/context/InputsHandlerContext';
import { Lodash } from '@/lib/lodashAdapter';

interface InputHandlerPropsTypes<T extends string> {
    preInputs: PreFormInputsType<T>;
    children: JSX.Element[] | JSX.Element;
}

const INPUTS_FIELDS_TO_OMIT_FROM_SERVER = ['required', 'validations', 'errors'];

export default function InputsHandler({
    preInputs,
    children,
}: InputHandlerPropsTypes<typeof preInputs>) {
    const [inputs, setInputs] = useState(onAddFormInputsFields(preInputs));
    const [handledInputs, setHandledInputs] = useState(
        onOmitFormInputsFields(preInputs),
    );
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);

    return (
        <InputsHandledContext.Provider
            value={{
                showInputMessagesFromOutside,
                inputs,
                handledInputs,
                onChangeInput,
                updateInputsToSubmit,
                setShowInputsMessage,
            }}
        >
            {children}
        </InputsHandledContext.Provider>
    );

    function onChangeInput<T>({
        objectifiedName,
        targetProp,
        value,
    }: onChangeInputsProps<T>) {
        setInputs((prevInputs) => {
            // UPDATING THE OBJECT WITH THE NEW ESPECIFIC INPUT
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [targetProp]: value,
            };
            // RETURNED ALL INPUTS WITH THE SPECIFIC INPUT UPTATED
            return {
                ...prevInputs,
                [objectifiedName]: updatedInput,
            };
        });
        setHandledInputs((prevInputs) => {
            const updatedInput = {
                ...prevInputs[objectifiedName],
                [targetProp]: value,
            };
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
    const secondaryFieldsToOmit = INPUTS_FIELDS_TO_OMIT_FROM_SERVER;
    const handledInputs = Lodash.onOmitFields(
        preInputs,
        mainFieldsToOmit,
        secondaryFieldsToOmit,
    ) as FormInputsTypeToSubmit<string>;

    return handledInputs as FormHandledInputsType<typeof preInputs>;
}
