type InputStateType<T extends string> = {
    [key: T]: {
        showInputMessage: boolean;
        highlightInput: boolean;
    };
};
