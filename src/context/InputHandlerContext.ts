import React from 'react';

export interface onChangeInputsProps {
    fieldName: string;
    value: string;
    files: FileList | null;
}

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
