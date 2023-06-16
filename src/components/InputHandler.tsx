import InputHandlerContext from '@/context/InputHandlerContext';
import { onAddFormInputsFields } from '@/hooks/useInputHandler';
import { useState } from 'react';

interface InputHandlerPropsTypes {
    inputs: PreFormInputsType;
    children: JSX.Element[] | JSX.Element;
}

export default function InputHandler({
    inputs,
    children,
}: InputHandlerPropsTypes) {
    const [handledInputs, setHandledInputs] = useState(
        onAddFormInputsFields(inputs),
    );

    const updateHandledInputs = (value: FormInputsType) => {
        setHandledInputs(value);
    };
    return (
        <InputHandlerContext.Provider
            value={{
                handledInputs,
                updateHandledInputs,
            }}
        >
            {children}
        </InputHandlerContext.Provider>
    );
}
