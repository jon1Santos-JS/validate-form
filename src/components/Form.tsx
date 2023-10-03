import React, { useEffect, useState } from 'react';

const DEFAULT_MESSAGE = 'Invalid form';

type FormPropsTypes = {
    ownProps: Props;
    validateProps: ValidatePropsType;
    children: JSX.Element[] | JSX.Element;
};

type ValidatePropsType = {
    areInputsValid: () => boolean;
    onShowInputsMessage: (value: boolean) => void;
    setHighlightInputsClass: (value: boolean) => void;
};

type Props = {
    onSubmitInputs: () => Promise<string | undefined | void>;
    legend?: string;
    formError?: string | null;
    waitMessageToSubmit?: boolean;
    elementsToAdd?: (props: ElementsToAddProps) => JSX.Element;
    className: string;
};

export type ElementsToAddProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export default function FormFormProps({
    ownProps,
    children,
    validateProps,
}: FormPropsTypes) {
    const { areInputsValid, onShowInputsMessage, setHighlightInputsClass } =
        validateProps;
    const {
        onSubmitInputs,
        legend,
        formError,
        waitMessageToSubmit,
        elementsToAdd,
        className,
    } = ownProps;
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
            onShowInputsMessage(false);
        }, 2750);

        return () => clearTimeout(timerDownMessage);
    }, [onShowInputsMessage]);

    return (
        <form className={className}>
            <fieldset className="container">
                <div className="legend">
                    <legend>{legend}</legend>
                </div>
                {renderInputs()}
                {renderError()}
                {elementsToAdd && elementsToAdd({ onClick: handleClick })}
            </fieldset>
        </form>
    );

    function renderInputs() {
        const inputsElements = children as JSX.Element[];
        return (
            <div className="inputs">
                {inputsElements?.length > 1
                    ? inputsElements.map((child) => {
                          return (
                              <div
                                  className="field"
                                  key={child.props.ownProps.label}
                              >
                                  {child}
                              </div>
                          );
                      })
                    : children}
            </div>
        );
    }

    function renderError() {
        if (formError === null) return null;
        if (!showMessage) return <div className="form-error-message"></div>;
        return <div className="form-error-message">{message}</div>;
    }

    async function handleClick(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) {
        e.preventDefault();
        if (waitMessageToSubmit && showMessage) return; // WAITING THE MESSAGE GOES DOWN TO REQUEST
        setMessage(formError ?? DEFAULT_MESSAGE); // TO SET SUBMIT ERROR
        if (areInputsValid()) {
            const response = await onSubmitInputs();
            if (response === undefined) {
                setHighlightInputsClass(false);
                onShowInputsMessage(false);
                setShowMessage(false);
                return;
            }
            if (typeof response === 'string') {
                setMessage(response);
            }
            setShowMessage(true);
        }
        setShowMessage(true);
        setHighlightInputsClass(true);
        onShowInputsMessage(true);
    }
}
