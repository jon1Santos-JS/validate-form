import useValidate from '@/hooks/useValidate';
import React, { useContext, useEffect, useState } from 'react';
import InputHandlerContext from '@/context/InputHandlerContext';

const FORM_ERROR = 'Invalid form';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    onSubmitInputs: (
        inputs: HandledContent<FormInputsTypeToSubmit>,
    ) => Promise<string | undefined | void>;
    legend?: string;
    alternativeErrors?: string[];
    formDefaultError?: string;
    formSubmitError?: string;
}

const Form: React.FC<FormProps> = ({
    children,
    onSubmitInputs,
    legend,
    formDefaultError,
    formSubmitError,
}) => {
    const { inputs, setShowInputsMessage, updateInputsToSubmit } =
        useContext(InputHandlerContext);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState(
        formDefaultError ? formDefaultError : FORM_ERROR,
    );
    const { validateAllInputs } = useValidate();

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setShowInputsMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [setShowInputsMessage]);

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setShowMessage(false);
        }, 2750);

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
        const inputsElements = children as JSX.Element[];
        if (inputsElements?.length > 1) {
            return inputsElements.map((child) => (
                <div key={child.props.label}>{child}</div>
            ));
        }
        return children;
    }

    function renderError() {
        if (!showMessage) return null;
        return <div className="notification is-danger">{message}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (!validateAllInputs(inputs)) {
            const inputsToSubmit = updateInputsToSubmit();
            if (showMessage) return; // TO MITIGATE THE AMOUNT OF REQUISITIONS
            const response = await onSubmitInputs(inputsToSubmit);
            if (typeof response === 'string') {
                setMessage(formSubmitError ? formSubmitError : FORM_ERROR); // TO SET SUBMIT ERROR
                setShowMessage(true);
                return;
            }
            setShowInputsMessage(false);
            setShowMessage(false);
            return;
        }
        setShowMessage(true);
        setShowInputsMessage(true);
    }
};

export default Form;
