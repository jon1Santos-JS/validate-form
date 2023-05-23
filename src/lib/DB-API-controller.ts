import { MiniDBAccountHandler } from '@/database/accountHandler';
import { MiniDBHandler } from '@/database/miniDBHandler';

export async function getDBUsersController() {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getUsers');
    const conditionalResponse =
        typeof response === 'string'
            ? response
            : (response as InputDataBaseType[]);
    return conditionalResponse;
}

export async function getDBStateController() {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB('getDB');
    const conditionalResponse =
        typeof response === 'string' ? response : (response as MiniDBState);
    return conditionalResponse;
}

export async function resetOrRefreshDBStateController(
    command: 'refresh' | 'reset',
) {
    const DBHandler = new MiniDBHandler();
    const response = await DBHandler.handleDB(command);
    const conditionalResponse = typeof response === 'string' ? response : true;
    return conditionalResponse;
}

export async function signInController(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signIn(userAccount);
    const conditionalResponse =
        typeof response === 'string'
            ? response
            : (response as InputDataBaseType);
    return conditionalResponse;
}

export async function signUpController(userAccount: InputDataBaseType) {
    const accountsHandler = new MiniDBAccountHandler();
    const response = await accountsHandler.signUp(userAccount);
    const conditionalResponse = typeof response === 'string' ? response : true;
    return conditionalResponse;
}
