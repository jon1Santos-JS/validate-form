import React from 'react';

interface InputHandlerContextType {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType;
    onChangeInput: (props: onChangeInputsProps) => void;
    updateInputsToSubmit: () => FormInputsTypeToSubmit;
    setShowInputsMessage: (value: boolean) => void;
}

export default React.createContext<InputHandlerContextType>({
    showInputMessagesFromOutside: false,
    inputs: {},
    updateInputsToSubmit: () => ({}),
    onChangeInput: () => 1,
    setShowInputsMessage: () => 1,
});
