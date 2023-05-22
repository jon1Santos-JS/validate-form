export function createTimeStamp(userAccount: InputDataBaseType) {
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

export function createID(userAccount: InputDataBaseType, currentID: number) {
    const inputWithID = {
        ID: currentID + 1,
        ...userAccount,
    };
    return inputWithID;
}

export function createConstraint(
    userAccount: InputDataBaseType,
    constraint: ConstraintsType,
) {
    const userWithConstraint = { constraint: constraint, ...userAccount };
    return userWithConstraint;
}
