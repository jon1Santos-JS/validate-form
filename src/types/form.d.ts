declare type HandledInputsType<T extends string> = {
    [key in T]: Partial<ValidateInputType<T>>;
};

declare type InputsToValidateType<T extends string> = {
    [key in T]: ValidateInputType<T>;
};

declare interface ValidateInputType<T extends string> {
    validations?: ValidateFunctionType<T>;
    errors: string[];
    value: string;
    crossfield?: T;
    files?: FileList | null;
    required?: string | boolean;
}

declare type ValidateFunctionType<T extends string> = (
    currentInputValue: string,
    conditionalInputValue?: InputsToValidateType<T>,
) => Validation[];

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}

declare type InputState<T extends string> = {
    showInputMessage: boolean;
    highlightInput: boolean;
    onShowInputMessage: (value: boolean, key: T) => void;
    onHighlightInput: (value: boolean, key: T) => void;
};
