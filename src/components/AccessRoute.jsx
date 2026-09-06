import {
    Navigate,
    Outlet
} from "react-router-dom";

import {
    hasSiteAccess
} from "../utils/auth";

function AccessRoute() {

    if (!hasSiteAccess()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    return <Outlet />;
}

export default AccessRoute;