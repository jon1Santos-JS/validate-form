declare interface ReturnValidationFunctionsType {
    [key: string]: ValidationFunctionType;
}

declare type ValidationFunctionType = (
    currentInputValue?: string,
    fieldName: string,
) => string[] | undefined;
