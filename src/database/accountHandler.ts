import {
    createConstraint,
    createID,
    createTimeStamp,
} from '@/lib/inputHandler';
import { DataBase } from './miniDB';
import { MiniDBHandler } from './miniDBHandler';

export class MiniDBAccountHandler {
    #DB = new MiniDBHandler();

    async signIn(userAccount: InputDataBaseType) {
        if (!(await this.#onInitDB())) return null;
        const account = this.#authAccount(userAccount);
        if (!account) {
            console.log('account was not found');
            return null;
        }
        console.log(JSON.stringify(account, undefined, 2));
        return { username: userAccount.username.value };
    }

    async signUp(userAccount: InputDataBaseType) {
        if (!(await this.#onInitDB())) return null;
        if (this.#authAccount(userAccount)) {
            console.log('account already exist');
            return null;
        }
        const response = await this.#createAccount(userAccount);
        if (!response) return null;
        return { username: userAccount.username.value };
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return true;
        } catch {
            return null;
        }
    }

    // DONT NEED 'TO REFRESH DB' WHEN 'INIT FUNCTION' HAVE BEEN CALLED BY BOTH FUNCTIONS SIGN IN AND SIGN UP
    #authAccount(userAccount: InputDataBaseType) {
        const account = DataBase.state.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
        });
        if (!account) return null;
        return account;
    }

    async #createAccount(userAccount: InputDataBaseType) {
        const userAccountHandled = this.#onHandleInputs(userAccount);
        DataBase.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - createAccount',
        );

        if (!response) return null;
        return response;
    }

    #onHandleInputs(userAccount: InputDataBaseType) {
        const accountWithConstraint = createConstraint(userAccount, 'user');
        const accountWithID = createID(
            accountWithConstraint,
            DataBase.state.accounts.length,
        );
        const accountWithTimeStamp = createTimeStamp(accountWithID);
        return accountWithTimeStamp;
    }
}
