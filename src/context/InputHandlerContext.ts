import React from 'react';

interface InputHandlerContextType {
    handledInputs: FormInputsType;
    updateHandledInputs: (value: FormInputsType) => void;
}

export default React.createContext<InputHandlerContextType>({
    handledInputs: {},
    updateHandledInputs: () => 1,
});
