import {
    useState
} from "react";

import {
    FaPaperPlane,
    FaShieldAlt
} from "react-icons/fa";

import api from "../api/api";

import {
    useToast
} from "../context/ToastContext";


function GuestDonationRequestForm() {

    const toast =
        useToast();

    const [loading, setLoading] =
        useState(false);

    const [form, setForm] =
        useState({
            fullName: "",
            phone: "",
            trxId: "",
            amount: "",
            transactionDate: "",
            transactionTime: ""
        });


    const handleChange = (e) => {

        setForm((current) => ({
            ...current,
            [e.target.name]:
                e.target.value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const payload = {

            fullName:
                form.fullName.trim(),

            phone:
                form.phone.trim(),

            trxId:
                form.trxId.trim(),

            amount:
                Number(form.amount),

            transactionDate:
                form.transactionDate,

            transactionTime:
                form.transactionTime

        };

        if (
            !payload.fullName ||
            !payload.phone ||
            !payload.trxId ||
            !payload.transactionDate ||
            !payload.transactionTime
        ) {

            toast.warning(
                "Please complete all transaction details."
            );

            return;

        }

        if (
            !Number.isFinite(
                payload.amount
            ) ||
            payload.amount <= 0
        ) {

            toast.warning(
                "Donation amount must be greater than zero."
            );

            return;

        }

        try {

            setLoading(true);

            const res =
                await api.post(
                    "/donations/requests",
                    payload
                );

            toast.success(
                res.data?.message ||
                "Donation submitted for verification."
            );

            setForm({
                fullName: "",
                phone: "",
                trxId: "",
                amount: "",
                transactionDate: "",
                transactionTime: ""
            });

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Unable to submit donation details."
            );

        } finally {

            setLoading(false);

        }

    };


    return (
        <>
            <style>
                {`
                    .guest-donation-card {
                        margin-top: 28px;
                        background: white;
                        border:
                            1px solid #dcebe3;
                        border-radius: 18px;
                        overflow: hidden;
                        box-shadow:
                            0 7px 25px
                            rgba(28,60,42,.05);
                    }

                    .guest-donation-header {
                        padding: 22px 25px;
                        display: flex;
                        align-items: center;
                        gap: 13px;
                        background:
                            linear-gradient(
                                135deg,
                                #f3faf6,
                                #ffffff
                            );
                        border-bottom:
                            1px solid #edf2ef;
                    }

                    .guest-donation-icon {
                        width: 44px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 12px;
                        background: #eaf7f0;
                        color: #198754;
                        font-size: 18px;
                    }

                    .guest-donation-title {
                        margin: 0;
                        font-size: 18px;
                        font-weight: 700;
                        color: #26372e;
                    }

                    .guest-donation-subtitle {
                        margin: 4px 0 0;
                        font-size: 12px;
                        color: #85918a;
                    }

                    .guest-donation-body {
                        padding: 25px;
                    }

                    .guest-form-control {
                        min-height: 47px;
                        border-radius: 10px;
                        border: 1px solid #dfe6e2;
                        box-shadow: none !important;
                        background: #fbfcfb;
                    }

                    .guest-form-control:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .guest-submit-btn {
                        min-height: 48px;
                        border-radius: 10px;
                        font-weight: 600;
                    }

                    .guest-security-note {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        margin-top: 17px;
                        padding: 11px 13px;
                        border-radius: 9px;
                        background: #f6f9f7;
                        color: #738078;
                        font-size: 11px;
                    }
                `}
            </style>

            <div className="guest-donation-card">

                <div className="guest-donation-header">

                    <div className="guest-donation-icon">
                        <FaPaperPlane />
                    </div>

                    <div>

                        <h3 className="guest-donation-title">
                            Submit Donation for Verification
                        </h3>

                        <p className="guest-donation-subtitle">
                            Your donation will appear in AFBROS records after approval by the Finance Manager.
                        </p>

                    </div>

                </div>

                <div className="guest-donation-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Full Name
                                </label>

                                <input
                                    name="fullName"
                                    className="form-control guest-form-control"
                                    placeholder="Your full name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Phone Number
                                </label>

                                <input
                                    name="phone"
                                    className="form-control guest-form-control"
                                    placeholder="Phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Transaction ID
                                </label>

                                <input
                                    name="trxId"
                                    className="form-control guest-form-control"
                                    placeholder="TRX / Reference ID"
                                    value={form.trxId}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    name="amount"
                                    className="form-control guest-form-control"
                                    placeholder="Donation amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Transaction Date
                                </label>

                                <input
                                    type="date"
                                    name="transactionDate"
                                    className="form-control guest-form-control"
                                    value={form.transactionDate}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Transaction Time
                                </label>

                                <input
                                    type="time"
                                    name="transactionTime"
                                    className="form-control guest-form-control"
                                    value={form.transactionTime}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success guest-submit-btn w-100 mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="me-2" />
                                    Submit for Verification
                                </>
                            )}
                        </button>

                    </form>

                    <div className="guest-security-note">

                        <FaShieldAlt />

                        Transaction details are sent to the Finance Manager for verification before being included in AFBROS financial totals.

                    </div>

                </div>

            </div>
        </>
    );
}

export default GuestDonationRequestForm;