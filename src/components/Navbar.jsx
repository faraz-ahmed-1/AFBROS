import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    FaChartPie,
    FaUsers,
    FaReceipt,
    FaSignOutAlt,
    FaUserLock
} from "react-icons/fa";

import {
    useState
} from "react";

import ConfirmModal from "./ConfirmModal";

import {
    useToast
} from "../context/ToastContext";

import {
    clearAuthentication,
    isFinanceManager,
    isGuest,
    leaveGuestMode
} from "../utils/auth";


function Navbar() {

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const toast =
        useToast();

    const manager =
        isFinanceManager();

    const guest =
        isGuest();

    const [
        showLogoutConfirm,
        setShowLogoutConfirm
    ] = useState(false);


    const active = (path) =>
        location.pathname === path;


    const logout = () => {

        clearAuthentication();

        setShowLogoutConfirm(false);

        toast.success(
            "Logged out successfully."
        );

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    const managerLogin = () => {

        leaveGuestMode();

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };


    return (
        <>
            <style>
                {`
                    .afbros-navbar {
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                        background:
                            linear-gradient(
                                135deg,
                                #0d5c3b,
                                #198754
                            );
                        box-shadow:
                            0 4px 18px
                            rgba(21,67,45,.15);
                    }

                    .afbros-navbar-brand {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: white !important;
                        text-decoration: none;
                    }

                    .nav-logo {
                        width: 38px;
                        height: 38px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border-radius: 10px;
                        background: rgba(255,255,255,.15);
                        font-weight: 800;
                    }

                    .nav-brand-title {
                        font-weight: 700;
                        font-size: 16px;
                    }

                    .nav-brand-subtitle {
                        display: block;
                        font-size: 9px;
                        color: rgba(255,255,255,.65);
                        text-transform: uppercase;
                    }

                    .afbros-nav-link {
                        display: flex !important;
                        align-items: center;
                        gap: 7px;
                        color:
                            rgba(255,255,255,.75)
                            !important;
                        border-radius: 9px;
                        padding: 9px 13px !important;
                        font-size: 13px;
                    }

                    .afbros-nav-link.active,
                    .afbros-nav-link:hover {
                        background:
                            rgba(255,255,255,.14);
                        color: white !important;
                    }

                    .guest-badge {
                        margin-left: 12px;
                        padding: 7px 11px;
                        background:
                            rgba(255,255,255,.13);
                        color: white;
                        border-radius: 30px;
                        font-size: 11px;
                        font-weight: 600;
                    }

                    .nav-action-btn {
                        margin-left: 12px;
                        display: flex;
                        gap: 7px;
                        align-items: center;
                        min-height: 38px;
                        padding: 8px 14px;
                        border-radius: 9px;
                        border:
                            1px solid
                            rgba(255,255,255,.3);
                        color: white;
                        background:
                            rgba(255,255,255,.05);
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .nav-action-btn:hover {
                        background: white;
                        color: #198754;
                    }

                    @media(max-width:991px) {
                        .guest-badge {
                            display: inline-block;
                            margin: 10px 0 5px;
                        }

                        .nav-action-btn {
                            width: 100%;
                            margin: 8px 0;
                            justify-content: center;
                        }
                    }
                `}
            </style>

            <nav className="navbar navbar-expand-lg navbar-dark afbros-navbar">

                <div className="container">

                    <Link
                        className="afbros-navbar-brand"
                        to="/"
                    >

                        <div className="nav-logo">
                            A
                        </div>

                        <div>
                            <div className="nav-brand-title">
                                AFBROS Finance
                            </div>

                            <span className="nav-brand-subtitle">
                                Management System
                            </span>
                        </div>

                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#afbrosNavbar"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="afbrosNavbar"
                    >

                        <ul className="navbar-nav ms-auto">

                            <li className="nav-item">

                                <Link
                                    to="/"
                                    className={`nav-link afbros-nav-link ${
                                        active("/")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <FaChartPie />
                                    Dashboard
                                </Link>

                            </li>

                            <li className="nav-item">

                                <Link
                                    to="/depositors"
                                    className={`nav-link afbros-nav-link ${
                                        active("/depositors")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <FaUsers />
                                    Donors
                                </Link>

                            </li>

                            <li className="nav-item">

                                <Link
                                    to="/expenses"
                                    className={`nav-link afbros-nav-link ${
                                        active("/expenses")
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    <FaReceipt />
                                    Expenses
                                </Link>

                            </li>

                        </ul>

                        {guest && (

                            <span className="guest-badge">
                                Guest • Read Only
                            </span>

                        )}

                        {manager ? (

                            <button
                                className="nav-action-btn"
                                onClick={() =>
                                    setShowLogoutConfirm(
                                        true
                                    )
                                }
                            >
                                <FaSignOutAlt />
                                Logout
                            </button>

                        ) : (

                            <button
                                className="nav-action-btn"
                                onClick={managerLogin}
                            >
                                <FaUserLock />
                                Manager Login
                            </button>

                        )}

                    </div>

                </div>

            </nav>

            <ConfirmModal
                show={showLogoutConfirm}
                title="Logout?"
                message="Are you sure you want to logout from your AFBROS finance account?"
                confirmText="Logout"
                cancelText="Cancel"
                onCancel={() =>
                    setShowLogoutConfirm(
                        false
                    )
                }
                onConfirm={logout}
            />

        </>
    );
}

export default Navbar;