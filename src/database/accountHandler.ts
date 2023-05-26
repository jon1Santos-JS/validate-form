import {
    onCreateConstraint,
    onCreateID,
    onCreateTimeStamp,
} from '@/lib/inputHandler';
import { DATABASE, SERVER_ERROR_RESPONSE } from './miniDB';
import { MiniDBHandler } from './miniDBHandler';

export class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: UserFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authAccount(userAccount)) {
            console.log('account was not found');
            return SERVER_ERROR_RESPONSE;
        }
        console.log(userAccount);
        return userAccount;
    }

    async signUp(userAccount: UserFromClientType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (this.#authAccount(userAccount)) {
            console.log('account already exist');
            return SERVER_ERROR_RESPONSE;
        }
        const response = await this.#createAccount(userAccount);
        if (!response) {
            console.log(`user: ${userAccount.username.value} has been created`);
            return;
        }
        return SERVER_ERROR_RESPONSE;
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return;
        } catch {
            return SERVER_ERROR_RESPONSE;
        }
    }

    // DONT NEED 'TO REFRESH DB (async)' WHEN 'INIT FUNCTION' HAVE BEEN CALLED BY BOTH FUNCTIONS SIGN IN AND SIGN UP
    #authAccount(userAccount: UserFromClientType) {
        const account = DATABASE.state.accounts.find((DBAccount) => {
            if (DBAccount.username.value !== userAccount.username.value) {
                return;
            }
            return DBAccount;
        });
        return account;
    }

    async #createAccount(userAccount: UserFromClientType) {
        const userAccountHandled: UserFromDataBaseType =
            this.#onHandleInputs(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - createAccount',
        );
        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    #onHandleInputs(userAccount: UserFromClientType) {
        const accountWithConstraint = onCreateConstraint(userAccount, 'user');
        const accountWithID = onCreateID(
            accountWithConstraint,
            DATABASE.state.accounts.length,
        );
        const accountWithTimeStamp = onCreateTimeStamp(accountWithID);
        return accountWithTimeStamp as UserFromDataBaseType;
    }
}
