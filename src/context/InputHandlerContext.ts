import React from 'react';

interface InputHandlerContextType {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType;
    updateInputValue: (value: string, fieldName: string) => void;
    updateInputsToSubmit: () => void;
    setShowInputsMessage: (value: boolean) => void;
}

export default React.createContext<InputHandlerContextType>({
    showInputMessagesFromOutside: false,
    inputs: {},
    updateInputsToSubmit: () => 1,
    updateInputValue: () => 1,
    setShowInputsMessage: () => 1,
});
