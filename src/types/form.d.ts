declare type HandledInputsType<T extends string> = {
    [key in T]: Partial<ValidateInputType<T>>;
};

declare type InputsToValidateType<T extends string> = {
    [key in T]: ValidateInputType<T>;
};

declare interface ValidateInputType<T extends string> {
    asyncValidations?: AsyncValidateFunctionType<T>;
    validations?: ValidateFunctionType<T>;
    errors: string[];
    value: string;
    crossfields?: T[];
    files?: FileList | null;
    required?: string | boolean;
}

declare type ValidateFunctionType<T extends string> = (
    currentInputValue: string,
    conditionalInputValue?: InputsToValidateType<T>,
) => Validation[];

declare type AsyncValidateFunctionType<T extends string> = (
    currentInputValue: string,
    conditionalInputValue?: InputsToValidateType<T>,
) => Promise<Validation[]>;

declare interface Validation {
    conditional: boolean | RegExpMatchArray | null | Promise<boolean | string>;
    message: string;
}

declare type InputState<T extends string> = {
    showInputMessage: boolean;
    highlightInput: boolean;
    onShowInputMessage?: (value: boolean, key: T) => void;
    onHighlightInput?: (value: boolean, key: T) => void;
};
