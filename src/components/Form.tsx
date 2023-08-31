import useValidate from '@/hooks/useValidate';
import React, { useEffect, useState } from 'react';

const FORM_ERROR = 'Invalid form';

interface FormPropsTypes<T extends string> {
    ownProps: PropsType<T>;
    handleInputsProps: HandleInputsPropsType<T>;
    children: JSX.Element[] | JSX.Element;
}

interface PropsType<T extends string> {
    onSubmitInputs: <R extends FormHandledInputsType<T>>(
        handledInputs: R,
    ) => Promise<string | undefined | void>;
    legend?: string;
    formDefaultError?: string;
    formSubmitError?: string;
}

export default function FormFormProps<T extends string>({
    ownProps,
    handleInputsProps,
    children,
}: FormPropsTypes<T>) {
    const { onSubmitInputs, legend, formDefaultError, formSubmitError } =
        ownProps;
    const { inputs, handledInputs, setShowInputsMessage } = handleInputsProps;
    const { validateAllInputs } = useValidate();
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState(
        formDefaultError ? formDefaultError : FORM_ERROR,
    );

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
                {renderElements()}
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

    function renderElements() {
        const inputsElements = children as JSX.Element[];
        if (inputsElements?.length > 1) {
            return inputsElements.map((child) => (
                <div key={child.props.ownProps.label}>{child}</div>
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
            if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
            const response = await onSubmitInputs(handledInputs);
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
}
