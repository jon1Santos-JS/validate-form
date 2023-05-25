export function onCreateTimeStamp(userAccount: UserFromClientType) {
    const todaysDate = new Date();
    const todaysDateFormated = todaysDate
        .toLocaleString()
        .split(', ')
        .join('-');
    const accountWithTimeStamp = {
        ...userAccount,
        timeStamp: todaysDateFormated,
    };

    return accountWithTimeStamp;
}

export function onCreateID(userAccount: UserFromClientType, currentID: number) {
    const inputWithID = {
        ID: currentID + 1,
        ...userAccount,
    };
    return inputWithID;
}

export function onCreateConstraint(
    userAccount: UserFromClientType,
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
    return handledAccount as UserFromClientType[];
}
