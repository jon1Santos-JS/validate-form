import React from 'react';

interface InputsHandlerContextType {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType<string>;
    handledInputs: FormHandledInputsType<string>;
    onChangeInput: <T>(props: onChangeInputsProps<T>) => void;
    updateInputsToSubmit: () => FormInputsTypeToSubmit<string>;
    setShowInputsMessage: (value: boolean) => void;
}

export default React.createContext<InputsHandlerContextType>({
    showInputMessagesFromOutside: false,
    inputs: {},
    handledInputs: {},
    updateInputsToSubmit: () => ({}),
    onChangeInput: () => undefined,
    setShowInputsMessage: () => undefined,
});
