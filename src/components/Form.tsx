import FormContext from '@/context/FormContext';
import useInputHandler from '@/hooks/useInputHandler';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validateAllInputs: () => number | undefined;
    requestApi: <T>(content: T) => Promise<boolean>;
    inputs: FormInputsType;
    legend?: string;
    setUser: (user: boolean) => void;
    hasUser: () => boolean;
    pushRoute?: string;
}

const Form: React.FC<FormProps> = ({
    children,
    validateAllInputs,
    requestApi,
    inputs,
    legend,
    setUser,
    pushRoute = '/',
}) => {
    const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);
    const [showInputErrorsMessages, setshowInputErrorsMessages] =
        useState(false);
    const { onOmitInputs, onSubmitInputs } = useInputHandler();
    const router = useRouter();

    useEffect(() => {
        // TO DOWN MESSAGE
        const timerDownMessage = setTimeout(() => {
            setshowInputErrorsMessages(false);
            setShowErrorMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showInputErrorsMessages]);

    return (
        <form className="c-form">
            <fieldset>
                <legend>{legend}</legend>
                {renderInputs()}
                {renderError()}
                <button
                    className="button is-primary"
                    onClick={(e) => handleClick(e)}
                >
                    Submit
                </button>
            </fieldset>
        </form>
    );

    function renderInputs() {
        const inputs = children as JSX.Element[];
        if (inputs?.length > 1) {
            return (
                <FormContext.Provider
                    value={{
                        showInputErrorsMessagesByForm: showInputErrorsMessages,
                    }}
                >
                    {inputs.map((child) => (
                        <div key={child.props.label}>{child}</div>
                    ))}
                </FormContext.Provider>
            );
        }
        return (
            <FormContext.Provider
                value={{
                    showInputErrorsMessagesByForm: showInputErrorsMessages,
                }}
            >
                {children}
            </FormContext.Provider>
        );
    }

    function renderError() {
        if (!showErrorMessage) return null;
        return <div className="notification is-danger">{'Invalid form'}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (!validateAllInputs()) {
            const formatedInputs = onHandleInputs();
            const response = await onSubmitInputs<typeof formatedInputs>(
                formatedInputs,
                requestApi,
            );
            setshowInputErrorsMessages(false);
            setShowErrorMessage(false);
            setUser(response);
            if (response) router.push(pushRoute);
            return;
        }
        setShowErrorMessage(true);
        setshowInputErrorsMessages(true);
    }

    function onHandleInputs() {
        const newInputs = inputs;
        const inputKeys = Object.keys(newInputs).filter((key) =>
            key.includes('confirm'),
        );
        const inputsWithoutConfirmField = onOmitInputs<
            FormInputsType,
            FormInputTypeToSubmit
        >(newInputs, [...inputKeys]);

        for (const i in inputsWithoutConfirmField) {
            const fieldsWithOnlyValueInput = onOmitInputs<
                FormInputTypeToSubmit,
                FormInputTypeToSubmit
            >(inputsWithoutConfirmField[i] as FormInputTypeToSubmit, [
                'isEmpty',
                'errors',
                'validations',
            ]);
            inputsWithoutConfirmField[i] = fieldsWithOnlyValueInput;
        }

        return inputsWithoutConfirmField;
    }
};

export default Form;
