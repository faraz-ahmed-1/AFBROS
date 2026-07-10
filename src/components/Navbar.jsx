import { Link, useLocation } from "react-router-dom";

function Navbar() {

    const location = useLocation();

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow">

            <div className="container">

                <Link className="navbar-brand fw-bold" to="/">
                    AFBROS Finance System
                </Link>

                <button
                    className="navbar-toggler"
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

                </div>

            </div>

        </nav>

    );

}

export default Navbar;