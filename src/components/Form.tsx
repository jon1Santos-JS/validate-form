import useValidate from '@/hooks/useValidate';
import React, { useEffect, useState } from 'react';

const FORM_DEFAULT_ERROR = 'Invalid form';

interface FormPropsTypes<T extends string> {
    ownProps: PropsType;
    validateProps: ValidatePropsType<T>;
    children: JSX.Element[] | JSX.Element;
}

interface ValidatePropsType<T extends string> {
    inputs: HandledInputsType<T, ValidateInputType<T>>;
    setShowInputsMessage: (value: boolean) => void;
}

interface PropsType {
    onSubmitInputs: () => Promise<string | undefined | void>;
    legend?: string;
    formError?: string | null;
}

export default function FormFormProps<T extends string>({
    ownProps,
    children,
    validateProps,
}: FormPropsTypes<T>) {
    const { inputs, setShowInputsMessage } = validateProps;
    const { onSubmitInputs, legend, formError } = ownProps;
    const { validateAll } = useValidate(inputs);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState(
        formError ? formError : FORM_DEFAULT_ERROR,
    );

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setShowMessage(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [showMessage]);

    useEffect(() => {
        const timerDownMessage = setTimeout(() => {
            setShowInputsMessage(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [setShowInputsMessage]);

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
        if (!showMessage || formError === null) return null;
        return <div className="notification is-danger">{message}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (validateAll()) {
            if (showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
            const response = await onSubmitInputs();
            if (response !== undefined) {
                const conditional =
                    typeof response === 'string'
                        ? response
                        : FORM_DEFAULT_ERROR;
                setMessage(conditional); // TO SET SUBMIT ERROR
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
