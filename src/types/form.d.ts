declare interface FetchOptionsType {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: string;
}

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface FormInputTypeToSubmit {
    [key: string]: { value?: string };
}

declare interface FormInputPropsType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
    ) => Validation[];
    errors: string[];
    isEmpty: boolean;
    value?: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}
