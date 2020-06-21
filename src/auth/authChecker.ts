import { AuthChecker } from 'type-graphql';
import { Context } from '../index';

export const authChecker: AuthChecker<Context> = ({ root, args, context, info }, roles) => {
    const isLoggedIn = Boolean(context?.user?.id);
    if (isLoggedIn && roles.includes('IS_LOGGED_IN')) {
        return true;
    }

    return false; // or false if access is denied
};
