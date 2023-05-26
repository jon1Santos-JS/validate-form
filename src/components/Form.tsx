import FormContext from '@/context/FormContext';
import useInputHandler from '@/hooks/useInputHandler';
import React, { useEffect, useState } from 'react';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    validateAllInputs: () => number | undefined;
    requestApi: <T>(formContent: T) => Promise<void>;
    inputs: FormInputsType;
    legend?: string;
}

const Form: React.FC<FormProps> = ({
    children,
    validateAllInputs,
    requestApi,
    inputs,
    legend,
}) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [showInputsMessages, setShowInputMessages] = useState(false);
    const { onSubmitInputs, onOmitFormInputFields } = useInputHandler();

    useEffect(() => {
        // TO DOWN MESSAGE
        const timerDownMessage = setTimeout(() => {
            setShowInputMessages(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showInputsMessages]);

    useEffect(() => {
        // TO DOWN MESSAGE
        const timerDownMessage = setTimeout(() => {
            setShowMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [showMessage]);

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
                        showInputErrorsMessagesByForm: showInputsMessages,
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
                    showInputErrorsMessagesByForm: showInputsMessages,
                }}
            >
                {children}
            </FormContext.Provider>
        );
    }

    function renderError() {
        if (!showMessage) return null;
        return <div className="notification is-danger">{'Invalid form'}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (!validateAllInputs()) {
            const mainInputsToOmit = Object.keys(inputs).filter((key) =>
                key.includes('confirm'),
            );
            const secondaryInputsToOmit = ['required', 'errors', 'validations'];
            const handledInputs = onOmitFormInputFields(
                inputs,
                mainInputsToOmit,
                secondaryInputsToOmit,
            );
            setShowInputMessages(false);
            setShowMessage(false);
            await onSubmitInputs(handledInputs, requestApi);
            return;
        }
        setShowMessage(true);
        setShowInputMessages(true);
    }
};

export default Form;
