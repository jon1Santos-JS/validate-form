declare interface FetchOptionsType {
    method: MethodTypes;
    headers?: { [key: string]: string };
    body?: string;
}

declare type MethodTypes = 'GET' | 'DELETE' | 'POST';

declare interface FormInputsType {
    [key: string]: FormInputPropsType;
}

declare interface PreFormInputsType {
    [key: string]: PreFormInputPropsType;
}

declare interface FormInputPropsType {
    validations?: (
        currentInput: string,
        formInputs: FormInputsType,
    ) => Validation[];
    required: boolean | string;
    errors: string[];
    value: string;
}

declare interface PreFormInputPropsType extends FormInputPropsType {
    errors?: string[];
    value?: string;
}

declare interface Validation {
    coditional: boolean | RegExpMatchArray | null;
    message: string;
}
