import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AccessRoute from "./components/AccessRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Depositors from "./pages/Depositors";
import Expenses from "./pages/Expenses";

import {
    hasSiteAccess
} from "./utils/auth";


function AppLayout() {

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );

}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    element={<AccessRoute />}
                >

                    <Route
                        element={<AppLayout />}
                    >

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/depositors"
                            element={<Depositors />}
                        />

                        <Route
                            path="/expenses"
                            element={<Expenses />}
                        />

                    </Route>

                </Route>

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                hasSiteAccess()
                                    ? "/"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;