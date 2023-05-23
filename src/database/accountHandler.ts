import {
    createConstraint,
    createID,
    createTimeStamp,
} from '@/lib/inputHandler';
import { DATABASE, SERVER_ERROR_RESPONSE } from './miniDB';
import { MiniDBHandler } from './miniDBHandler';

export class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: InputDataBaseType) {
        if (await this.#onInitDB()) return SERVER_ERROR_RESPONSE;
        if (!this.#authAccount(userAccount)) {
            console.log('account was not found');
            return SERVER_ERROR_RESPONSE;
        }
        console.log(userAccount);
        return userAccount;
    }

    async signUp(userAccount: InputDataBaseType) {
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

    // DONT NEED 'TO REFRESH DB' WHEN 'INIT FUNCTION' HAVE BEEN CALLED BY BOTH FUNCTIONS SIGN IN AND SIGN UP
    #authAccount(userAccount: InputDataBaseType) {
        const account = DATABASE.state.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
        });
        if (!account) return;
        return account;
    }

    async #createAccount(userAccount: InputDataBaseType) {
        const userAccountHandled = this.#onHandleInputs(userAccount);
        DATABASE.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - createAccount',
        );

        if (!response) return;
        return SERVER_ERROR_RESPONSE;
    }

    #onHandleInputs(userAccount: InputDataBaseType) {
        const accountWithConstraint = createConstraint(userAccount, 'user');
        const accountWithID = createID(
            accountWithConstraint,
            DATABASE.state.accounts.length,
        );
        const accountWithTimeStamp = createTimeStamp(accountWithID);
        return accountWithTimeStamp;
    }
}
