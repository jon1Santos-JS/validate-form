export function onCreateID(
    userAccount: AccountFromClientType,
    currentID: number,
) {
    const inputWithID = {
        ID: currentID + 1,
        ...userAccount,
    };
    return inputWithID;
}

export function onCreateConstraint(
    userAccount: AccountFromClientType,
    constraint: ConstraintsType,
) {
    const userWithConstraint = { constraint: constraint, ...userAccount };
    return userWithConstraint;
}

export function onOmitDBInputFields(userAccount: UserFromDataBaseType[]) {
    const handledAccount = userAccount.map((user) => ({
        username: { value: user.username.value },
        password: { value: user.password.value },
    }));
    return handledAccount as AccountFromClientType[];
}
