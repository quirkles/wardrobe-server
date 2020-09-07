import { AuthChecker } from 'type-graphql';
import { Context } from '../index';

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
    const isLoggedIn = Boolean(context?.user?.id);
    return isLoggedIn && roles.includes('IS_LOGGED_IN');
};
