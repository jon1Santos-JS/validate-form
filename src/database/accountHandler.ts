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
        if (!(await this.#onInitDB())) return;
        const account = this.#authAccount(userAccount);
        if (!account) {
            console.log('account was not found');
            return;
        }
        const user = JSON.stringify({ username: userAccount.username.value });
        console.log(user);
        return user;
    }

    async signUp(userAccount: InputDataBaseType) {
        if (!(await this.#onInitDB())) return;
        if (this.#authAccount(userAccount)) {
            console.log('account already exist');
            return;
        }
        const response = await this.#createAccount(userAccount);
        if (!response) return;
        const user = JSON.stringify({ username: userAccount.username.value });
        console.log(user);
        return user;
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return 'DB has been initiated';
        } catch {
            return;
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
        if (!account) return;
        return account;
    }

    async #createAccount(userAccount: InputDataBaseType) {
        const userAccountHandled = this.#onHandleInputs(userAccount);
        DataBase.state.accounts.push(userAccountHandled);
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountHandler - createAccount',
        );

        if (!response) return;
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
