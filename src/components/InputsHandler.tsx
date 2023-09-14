import { onOmitProps } from '@/lib/lodashAdapter';
import { useState } from 'react';
import React from 'react';

const DEFAULT_INPUT_FIELDS_TO_OMIT: DefaultFieldsToOmitType[] = [
    'errors',
    'required',
    'validations',
];

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
    inputsToOmit?: [IO];
    inputFieldToOmit?: [IF];
}

export default function InputsHandler<
    T extends string,
    IO extends T,
    IF extends keyof PreFormInputPropsType<T>,
>({ ownProps }: InputHandlerPropsTypes<T, IO, IF>) {
    const { preInputs, renderChildren, inputsToOmit, inputFieldToOmit } =
        ownProps;
    const [inputs, setInputs] = useState(onAddRequiredFields());
    const [showInputMessagesFromOutside, setShowInputMessages] =
        useState(false);
    const handledInputs = onOmitFormInputs({ ...inputs });

    const handleInputsProps: HandleInputsPropsType<T> = {
        showInputMessagesFromOutside,
        inputs, // INPUTS TO VALIDATE (WITH VALIDATION FIELDS: ERRORS, VALUE AND VALIDATION)
        handledInputs, // INPUTS TO MANIPULATE OR SUBMIT(JUST WITH TARGET FIELDS: VALUE, FILE, ETC...)
        onChangeInput,
        setShowInputsMessage,
    };

    return <>{renderChildren(handleInputsProps)}</>;

    function onChangeInput<R extends T, U>({
        objectifiedName,
        targetProp,
        value,
    }: ChangeInputsTypes<R, U>) {
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

    function onAddRequiredFields() {
        const handledPreInputs = { ...preInputs };

        for (const i in handledPreInputs) {
            handledPreInputs[i] = {
                ...handledPreInputs[i],
                errors: [],
                value: '',
            };
        }

        return handledPreInputs as FormInputsType<T>;
    }

    function onOmitFormInputs(obj: FormInputsType<T>) {
        const inputsWithOmittedFields = onOmitInputFields(obj);
        if (inputsToOmit) {
            const objWithOmittedInputs = onOmitProps(
                inputsWithOmittedFields,
                inputsToOmit,
            );
            if (inputFieldToOmit)
                return objWithOmittedInputs as FormHandledInputsType<T, IF, IO>;
            return objWithOmittedInputs as FormHandledInputsType<
                T,
                DefaultFieldsToOmitType,
                IO
            >;
        }

        return inputsWithOmittedFields;
    }

    function onOmitInputFields(obj: PreFormInputsType<T>) {
        const handleObj = obj;

        if (inputFieldToOmit) {
            for (const i in handleObj) {
                handleObj[i] = onOmitProps(handleObj[i], inputFieldToOmit);
            }
            return handleObj as FormHandledInputsType<T, IF>;
        }
        for (const i in handleObj) {
            handleObj[i] = onOmitProps(
                handleObj[i],
                DEFAULT_INPUT_FIELDS_TO_OMIT,
            );
        }
        return handleObj as FormHandledInputsType<T>;
    }
}
