import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {

    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">

            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">
                    AFBROS Finance System
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbar">

                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/" ? "active fw-bold" : ""
                                }`}
                                to="/"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/depositors"
                                        ? "active fw-bold"
                                        : ""
                                }`}
                                to="/depositors"
                            >
                                Donors
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${
                                    location.pathname === "/expenses"
                                        ? "active fw-bold"
                                        : ""
                                }`}
                                to="/expenses"
                            >
                                Expenses
                            </Link>
                        </li>

                    </ul>

                    <button
                        className="btn btn-outline-light ms-3"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;