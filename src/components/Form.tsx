import useValidate from '@/hooks/useValidate';
import React, { useContext, useEffect, useState } from 'react';
import InputHandlerContext from '@/context/InputHandlerContext';

interface FormProps {
    children: JSX.Element[] | JSX.Element;
    onSubmitInputs: <T>(formContent: T) => Promise<void>;
    legend?: string;
}

const Form: React.FC<FormProps> = ({ children, onSubmitInputs, legend }) => {
    const {
        inputs,
        showInputMessages,
        setShowInputsMessage,
        updateInputsToSubmit,
    } = useContext(InputHandlerContext);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const { validateAllInputs } = useValidate();

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setShowInputsMessage(false);
        }, 2550);

        return () => clearTimeout(timerDownMessage);
    }, [setShowInputsMessage, showInputMessages]);

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
        return <div className="notification is-danger">{'Invalid form'}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (!validateAllInputs(inputs)) {
            const inputsToSubmit = updateInputsToSubmit();
            setShowInputsMessage(false);
            setShowMessage(false);
            await onSubmitInputs(inputsToSubmit);
            return;
        }
        setShowMessage(true);
        setShowInputsMessage(true);
    }
};

export default Form;
