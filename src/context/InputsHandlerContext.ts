import React from 'react';

interface InputsHandlerContextType {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType;
    onChangeInput: <T>(props: onChangeInputsProps<T>) => void;
    updateInputsToSubmit: () => FormInputsTypeToSubmit;
    setShowInputsMessage: (value: boolean) => void;
}

export default React.createContext<InputsHandlerContextType>({
    showInputMessagesFromOutside: false,
    inputs: {},
    updateInputsToSubmit: () => ({}),
    onChangeInput: () => 1,
    setShowInputsMessage: () => 1,
});
