declare interface ReturnValidationFunctionsType {
    [key: string]: Function;
}

declare type ValidationFunctionType = (
    currentInputValue?: string,
    fieldName: string,
) => string[] | undefined;
