import { useState } from 'react';
import { Lodash } from '@/lib/lodashAdapter';
import React from 'react';

const DEFAULT_INPUT_FIELDS_TO_OMIT = ['required', 'validations', 'errors'];

interface InputHandlerPropsTypes<
    T extends string,
    IO extends T,
    IF extends keyof PreFormInputPropsType<T>,
> {
    ownProps: PropsType<T, IO, IF>;
}

interface PropsType<
    T extends string,
    IO extends T,
    IF extends keyof PreFormInputPropsType<T>,
> {
    preInputs: PreFormInputsType<T>;
    renderChildren: (
        handleInputsProps: HandleInputsPropsType<T>,
    ) => JSX.Element;
    inputsToOmit?: IO[];
    inputFieldToOmit?: IF[];
}

export default function InputsHandler<
    T extends string,
    IO extends T,
    IF extends keyof PreFormInputPropsType<T>,
>({ ownProps }: InputHandlerPropsTypes<T, IO, IF>) {
    const { preInputs, renderChildren, inputsToOmit, inputFieldToOmit } =
        ownProps;
    const [inputs, setInputs] = useState(onAddFormInputsFields());
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);
    const handledInputs = onOmitFormInputsFields(inputs);

    const handleInputsProps: HandleInputsPropsType<T> = {
        showInputMessagesFromOutside,
        inputs, // INPUTS TO VALIDATE (WITH ERRORS, VALUE AND VALIDATION FIELDS)
        handledInputs, // INPUTS TO MANIPULATE OR SUBMIT(JUST WITH TARGET FIELDS)
        onChangeInput,
        setShowInputsMessage,
    };

    return <>{renderChildren(handleInputsProps)}</>;

    function onChangeInput<R extends T, U>({
        objectifiedName,
        targetProp,
        value,
    }: {
        objectifiedName: R;
        targetProp: TargetPropsType;
        value: U;
    }) {
        setInputs((prevInputs) => {
            // UPDATING THE SPECIFIC  TARGET PROP INTO THE SPECIFIC INPUT
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
    }

    function setShowInputsMessage(value: boolean) {
        setShowInputMessages(value);
    }

    function onAddFormInputsFields() {
        const handledInputs = onAddRequiredInputs();

        function onAddRequiredInputs() {
            for (const i in preInputs) {
                preInputs[i].errors = [];
                preInputs[i].value = '';
            }
            return preInputs;
        }

        return handledInputs as FormInputsType<T>;
    }

    function onOmitFormInputsFields(obj: FormInputsType<T>) {
        const defaultConfirms = Object.keys(obj as FormInputsType<T>).filter(
            (key) => key.includes('confirm'),
        );
        const toOmit = {
            inputs: inputsToOmit ? inputsToOmit : defaultConfirms,
            fields: inputFieldToOmit
                ? inputFieldToOmit
                : DEFAULT_INPUT_FIELDS_TO_OMIT,
        };

        const handledInputs = Lodash.onOmitFields(
            obj as FormInputsType<T>,
            toOmit.inputs,
            toOmit.fields,
        );

        return handledInputs as FormHandledInputsType<T>;
    }
}
