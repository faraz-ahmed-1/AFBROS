import {
    useEffect,
    useState
} from "react";

import DashboardCards
    from "../components/DashboardCards";

import DonationForm
    from "../components/DonationForm";

import ExpenseForm
    from "../components/ExpenseForm";

import GuestDonationRequestForm
    from "../components/GuestDonationRequestForm";

import api
    from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import {
    isFinanceManager,
    isGuest
} from "../utils/auth";


function Home() {

    const toast =
        useToast();

    const manager =
        isFinanceManager();

    const guest =
        isGuest();

    const [
        dashboard,
        setDashboard
    ] = useState({
        totalDonations: 0,
        totalExpenses: 0,
        remainingBalance: 0
    });

    const [loading, setLoading] =
        useState(true);


    const fetchDashboard = async (
        showError = true
    ) => {

        try {

            const res =
                await api.get(
                    "/dashboard"
                );

            setDashboard(
                res.data
            );

        } catch (err) {

            console.error(err);

            if (showError) {

                toast.error(
                    "Unable to load dashboard."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchDashboard(false);

    }, []);


    return (
        <>
            <style>
                {`
                    .afbros-home {
                        min-height: 100vh;
                        background: #f5f7f6;
                        padding: 40px 0 60px;
                    }

                    .afbros-home-header {
                        padding: 34px 38px;
                        border-radius: 22px;
                        color: white;
                        background:
                            linear-gradient(
                                135deg,
                                #0d5c3b,
                                #198754
                            );
                        box-shadow:
                            0 12px 35px
                            rgba(25,135,84,.16);
                    }

                    .afbros-home-title {
                        font-size: 31px;
                        font-weight: 700;
                        margin: 0;
                    }

                    .afbros-home-subtitle {
                        color:
                            rgba(255,255,255,.78);
                        margin: 8px 0 0;
                        font-size: 14px;
                    }

                    .guest-mode-notice {
                        margin-top: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 15px;
                        padding: 14px 17px;
                        background: #fff8e5;
                        border:
                            1px solid #f2dfaa;
                        border-radius: 12px;
                        color: #7b6421;
                        font-size: 13px;
                    }

                    .home-section {
                        margin-top: 28px;
                    }

                    .home-section-heading {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 17px;
                    }

                    .home-section-title {
                        font-size: 18px;
                        font-weight: 700;
                        color: #25352d;
                        margin: 0;
                    }

                    .home-section-text {
                        color: #87918c;
                        font-size: 13px;
                        margin: 3px 0 0;
                    }

                    .refresh-btn {
                        border:
                            1px solid #dce4df;
                        background: white;
                        color: #198754;
                        border-radius: 10px;
                        padding: 8px 15px;
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .transaction-wrapper {
                        position: relative;
                        height: 100%;
                        border:
                            1px solid #e7ece9;
                        border-radius: 18px;
                        background: white;
                        overflow: hidden;
                    }

                    .guest-disabled-banner {
                        margin: 10px 10px 0;
                        padding: 9px 12px;
                        border-radius: 9px;
                        background: #f4f6f5;
                        color: #7b8680;
                        font-size: 11px;
                        text-align: center;
                    }

                    .guest-disabled-fieldset {
                        border: 0;
                        padding: 0;
                        margin: 0;
                        width: 100%;
                    }

                    .guest-disabled-fieldset:disabled {
                        opacity: .58;
                    }

                    @media(max-width:767px) {
                        .afbros-home {
                            padding-top: 20px;
                        }

                        .afbros-home-header {
                            padding: 27px 24px;
                        }

                        .afbros-home-title {
                            font-size: 25px;
                        }

                        .guest-mode-notice {
                            align-items: flex-start;
                        }
                    }
                `}
            </style>

            <div className="afbros-home">

                <div className="container">

                    <div className="afbros-home-header">

                        <h1 className="afbros-home-title">
                            AFBROS Management System
                        </h1>

                        <p className="afbros-home-subtitle">
                            Donation & Expense Management
                        </p>

                    </div>

                    {guest && (

                        <div className="guest-mode-notice">

                            <div>
                                <strong>
                                    Guest Access
                                </strong>

                                <div>
                                    Financial information is read-only. Management controls are disabled.
                                </div>
                            </div>

                            <span className="badge bg-warning text-dark">
                                Read Only
                            </span>

                        </div>

                    )}

                    <div className="home-section">

                        <div className="home-section-heading">

                            <div>

                                <h2 className="home-section-title">
                                    Financial Overview
                                </h2>

                                <p className="home-section-text">
                                    Current approved donation and expense totals
                                </p>

                            </div>

                            <button
                                className="refresh-btn"
                                onClick={() =>
                                    fetchDashboard(
                                        true
                                    )
                                }
                            >
                                ↻ Refresh
                            </button>

                        </div>

                        {loading ? (

                            <div className="text-center bg-white rounded-4 p-5">
                                <span className="spinner-border text-success" />
                            </div>

                        ) : (

                            <DashboardCards
                                dashboard={dashboard}
                            />

                        )}

                    </div>

                    <div className="home-section mt-5">

                        <div className="home-section-heading">

                            <div>

                                <h2 className="home-section-title">
                                    Financial Transactions
                                </h2>

                                <p className="home-section-text">
                                    Finance Manager transaction controls
                                </p>

                            </div>

                        </div>

                        <div className="row g-4">

                            <div className="col-lg-6">

                                <div className="transaction-wrapper">

                                    {!manager && (

                                        <div className="guest-disabled-banner">
                                            Finance Manager access required to directly add donations.
                                        </div>

                                    )}

                                    <fieldset
                                        className="guest-disabled-fieldset"
                                        disabled={!manager}
                                    >

                                        <DonationForm
                                            refreshDashboard={() =>
                                                fetchDashboard(
                                                    false
                                                )
                                            }
                                        />

                                    </fieldset>

                                </div>

                            </div>

                            <div className="col-lg-6">

                                <div className="transaction-wrapper">

                                    {!manager && (

                                        <div className="guest-disabled-banner">
                                            Finance Manager access required to record expenses.
                                        </div>

                                    )}

                                    <fieldset
                                        className="guest-disabled-fieldset"
                                        disabled={!manager}
                                    >

                                        <ExpenseForm
                                            refreshDashboard={() =>
                                                fetchDashboard(
                                                    false
                                                )
                                            }
                                        />

                                    </fieldset>

                                </div>

                            </div>

                        </div>

                    </div>

                    {guest && (
                        <GuestDonationRequestForm />
                    )}

                </div>

            </div>
        </>
    );
}

export default Home;