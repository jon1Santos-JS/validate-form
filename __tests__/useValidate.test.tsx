import '@testing-library/jest-dom';
import useValidate from '@/hooks/useValidate';

const inputs: FormInputsType = {
    username: {
        validations: (currentInputValue: string) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Username must has 6 characters at least',
            },
            {
                coditional: !currentInputValue.match(/\D/),
                message: 'Only strings',
            },
        ],
        errors: [],
        isEmpty: true,
        value: 'asd123',
    },
    password: {
        validations: (currentInputValue) => [
            {
                coditional: !currentInputValue.match(/.{6,}/),
                message: 'Password must has 6 characters at least',
            },
        ],
        errors: [],
        isEmpty: true,
        value: 'asd123',
    },
    confirmPassword: {
        validations: (currentInputValue, formInputs) => [
            {
                coditional: currentInputValue !== formInputs['password'].value,
                message: 'This field has to be equal to the password',
            },
        ],
        errors: [],
        isEmpty: true,
        value: 'asd123',
    },
};

test('testing validate hook', async () => {
    const {
        validateUsername,
        validatePassword,
        validateAllInputs,
        validateCofirmPassword,
    } = useValidate(inputs);
    expect(validateUsername(inputs.username.value)).toBe(undefined);
    expect(validatePassword(inputs.password.value)).toBe(undefined);
    expect(validateCofirmPassword(inputs.confirmPassword.value)).toBe(
        undefined,
    );
    expect(validateAllInputs()).toBe(undefined);
});
