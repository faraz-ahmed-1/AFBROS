import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes
} from "react-router-dom";

import Navbar
    from "./components/Navbar";

import AccessRoute
    from "./components/AccessRoute";

import PdfReportButton
    from "./components/PdfReportButton";

import Home
    from "./pages/Home";

import Login
    from "./pages/Login";

import Depositors
    from "./pages/Depositors";

import Expenses
    from "./pages/Expenses";

import {
    hasSiteAccess
} from "./utils/auth";


function AppLayout() {

    return (
        <>

            <Navbar />

            <PdfReportButton />

            <Outlet />

        </>
    );

}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* MANAGER / GUEST ACCESS */}

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


                {/* FALLBACK */}

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