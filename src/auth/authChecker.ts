import { AuthChecker } from 'type-graphql';
import { AppContext } from '../server/appContext';

export const authChecker: AuthChecker<AppContext> = ({ context }, roles) => {
    const isLoggedIn = Boolean(context?.user?.id);
    return isLoggedIn && roles.includes('IS_LOGGED_IN');
};
