import useValidate from '@/hooks/useValidate';
import React, { useEffect, useState } from 'react';

const DEFAULT_MESSAGE = 'Invalid form';

interface FormPropsTypes<T extends string> {
    ownProps: Props;
    validateProps: ValidatePropsType<T>;
    children: JSX.Element[] | JSX.Element;
}

interface ValidatePropsType<T extends string> {
    inputs: InputsToValidateType<T>;
    setShowInputsMessage: (value: boolean) => void;
}

interface Props {
    onSubmitInputs: () => Promise<string | undefined | void>;
    legend?: string;
    formError?: string | null;
    waitMessageToSubmit?: boolean;
}

export default function FormFormProps<T extends string>({
    ownProps,
    children,
    validateProps,
}: FormPropsTypes<T>) {
    const { inputs, setShowInputsMessage } = validateProps;
    const { onSubmitInputs, legend, formError, waitMessageToSubmit } = ownProps;
    const { validateAll } = useValidate(inputs);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState(formError ?? DEFAULT_MESSAGE);

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
        if (waitMessageToSubmit && showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        setMessage(formError ?? DEFAULT_MESSAGE); // TO SET SUBMIT ERROR
        if (validateAll()) {
            const response = await onSubmitInputs();
            if (response === undefined) {
                setShowInputsMessage(false);
                setShowMessage(false);
                return;
            }
            if (typeof response === 'string') {
                setMessage(response);
            }
            setShowMessage(true);
        }
        setShowMessage(true);
        setShowInputsMessage(true);
    }
}
