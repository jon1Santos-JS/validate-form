import React from 'react';

export interface onChangeInputsValueProp {
    fieldName: string;
    value: string;
}

export interface onChangeInputsProps {
    fieldName: string;
    attribute: InputsAttributesFields;
    value: AttributesType;
}

interface InputHandlerContextType {
    showInputMessagesFromOutside: boolean;
    inputs: FormInputsType;
    onChangeInputValue: (props: onChangeInputsValueProp) => void;
    onChangeInput: (props: onChangeInputsProps) => void;
    updateInputsToSubmit: () => FormInputsTypeToSubmit;
    setShowInputsMessage: (value: boolean) => void;
}

export default React.createContext<InputHandlerContextType>({
    showInputMessagesFromOutside: false,
    inputs: {},
    updateInputsToSubmit: () => ({}),
    onChangeInputValue: () => 1,
    onChangeInput: () => 1,
    setShowInputsMessage: () => 1,
});
