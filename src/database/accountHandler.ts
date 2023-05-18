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
        if (!(await this.#onInitDB())) return 'internal server error';
        if (this.#authAccount(userAccount)) {
            console.log('account already exist');
            return 'account already exist';
        }
        return this.#createAccount(userAccount);
    }

    async #onInitDB() {
        try {
            await this.#DB.init();
            return true;
        } catch {
            return false;
        }
    }

    #authAccount(userAccount: InputDataBaseType) {
        const account = DataBase.state.accounts.find((value) => {
            if (
                value.password.value === userAccount.password.value &&
                value.username.value === userAccount.username.value
            )
                return value;
            return undefined;
        });
        if (!account) return false;
        return account;
    }

    async #createAccount(userAccount: InputDataBaseType) {
        DataBase.state.accounts.push(createConstraint(userAccount));
        const response = await this.#DB.handleDB(
            'refresh',
            'MiniDBAccountsHandler - createAccount',
        );
        if (response) return response;
        return 'account has been created';
    }
}

function createTimeStamp(userAccount: InputDataBaseType) {
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

function createID(userAccount: InputDataBaseType) {
    const inputWithID = {
        ID: DataBase.state.accounts.length + 1,
        ...userAccount,
    };
    return createTimeStamp(inputWithID);
}

function createConstraint(userAccount: InputDataBaseType) {
    const userWithConstraint = { constraint: 'user', ...userAccount };
    return createID(userWithConstraint);
}