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
    FaUserLock,
    FaClipboardList
} from "react-icons/fa";

import {
    useCallback,
    useEffect,
    useState
} from "react";

import api
    from "../api/api";

import ConfirmModal
    from "./ConfirmModal";

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


    const [
        pendingCount,
        setPendingCount
    ] = useState(0);


    const [
        mobileOpen,
        setMobileOpen
    ] = useState(false);


    // ==================================================
    // REQUEST COUNT
    // ==================================================

    const fetchPendingCount =
        useCallback(
            async () => {

                if (!manager) {

                    setPendingCount(0);

                    return;
                }


                try {

                    const res =
                        await api.get(
                            "/donations/requests/count"
                        );


                    setPendingCount(
                        Number(
                            res.data?.count ||
                            0
                        )
                    );

                } catch (err) {

                    console.error(
                        "REQUEST COUNT ERROR:",
                        err
                    );

                }

            },
            [manager]
        );


    useEffect(() => {

        fetchPendingCount();


        const update =
            () =>
                fetchPendingCount();


        window.addEventListener(
            "focus",
            update
        );


        window.addEventListener(
            "afbros-request-count-changed",
            update
        );


        return () => {

            window.removeEventListener(
                "focus",
                update
            );

            window.removeEventListener(
                "afbros-request-count-changed",
                update
            );

        };

    }, [fetchPendingCount]);


    const active = (path) =>
        location.pathname === path;


    const closeMobile = () => {

        setMobileOpen(false);

    };


    const logout = () => {

        clearAuthentication();

        setShowLogoutConfirm(
            false
        );


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


    const displayCount =
        pendingCount > 99
            ? "99+"
            : pendingCount;


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
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;
                        background:
                            rgba(255,255,255,.15);
                        font-weight: 800;
                    }

                    .nav-brand-title {
                        color: white;
                        font-size: 16px;
                        font-weight: 700;
                    }

                    .nav-brand-subtitle {
                        display: block;
                        color:
                            rgba(255,255,255,.65);
                        font-size: 9px;
                        text-transform: uppercase;
                    }

                    .afbros-nav-link {
                        display: flex !important;
                        align-items: center;
                        gap: 7px;
                        padding:
                            9px 13px !important;
                        border-radius: 9px;
                        color:
                            rgba(255,255,255,.75)
                            !important;
                        font-size: 13px;
                    }

                    .afbros-nav-link:hover,
                    .afbros-nav-link.active {
                        background:
                            rgba(255,255,255,.14);
                        color: white !important;
                    }

                    .request-nav-count {
                        min-width: 21px;
                        height: 21px;
                        padding: 0 6px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 20px;
                        background: white;
                        color: #198754;
                        font-size: 10px;
                        font-weight: 800;
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
                        align-items: center;
                        gap: 7px;
                        min-height: 38px;
                        padding: 8px 14px;
                        border:
                            1px solid
                            rgba(255,255,255,.3);
                        border-radius: 9px;
                        background:
                            rgba(255,255,255,.05);
                        color: white;
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .nav-action-btn:hover {
                        background: white;
                        color: #198754;
                    }

                    .mobile-toggler-wrap {
                        position: relative;
                    }

                    .mobile-pending-badge {
                        position: absolute;
                        top: -7px;
                        right: -8px;
                        z-index: 5;
                        min-width: 21px;
                        height: 21px;
                        padding: 0 5px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 20px;
                        background: #dc3545;
                        color: white;
                        border: 2px solid #198754;
                        font-size: 9px;
                        font-weight: 800;
                    }

                    @media(min-width:992px) {
                        .mobile-pending-badge {
                            display: none;
                        }
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
                        onClick={closeMobile}
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


                    <div className="mobile-toggler-wrap">

                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#afbrosNavbar"
                            onClick={() =>
                                setMobileOpen(
                                    (current) =>
                                        !current
                                )
                            }
                        >
                            <span className="navbar-toggler-icon" />
                        </button>


                        {manager &&
                            pendingCount > 0 &&
                            !mobileOpen && (

                            <span className="mobile-pending-badge">
                                {displayCount}
                            </span>

                        )}

                    </div>


                    <div
                        className="collapse navbar-collapse"
                        id="afbrosNavbar"
                    >

                        <ul className="navbar-nav ms-auto">


                            <li className="nav-item">

                                <Link
                                    to="/"
                                    onClick={closeMobile}
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
                                    onClick={closeMobile}
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
                                    onClick={closeMobile}
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


                            <li className="nav-item">

                                <Link
                                    to="/requests"
                                    onClick={closeMobile}
                                    className={`nav-link afbros-nav-link ${
                                        active("/requests")
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <FaClipboardList />

                                    Requests

                                    {manager &&
                                        pendingCount > 0 && (

                                        <span className="request-nav-count">
                                            {displayCount}
                                        </span>

                                    )}

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
                                type="button"
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
                                type="button"
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
                show={
                    showLogoutConfirm
                }
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