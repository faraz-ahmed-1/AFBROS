import { useState } from "react";
import { FaHandHoldingHeart } from "react-icons/fa";

import api from "../api/api";
import { useToast } from "../context/ToastContext";

function DonationForm({
    refreshDashboard
}) {

    const toast = useToast();

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        amount: "",
        date: ""
    });

    const [loading, setLoading] =
        useState(false);

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm((current) => ({
            ...current,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const fullName =
            form.fullName.trim();

        const phone =
            form.phone.trim();

        const amount =
            Number(form.amount);

        if (
            !fullName ||
            !phone ||
            !form.date
        ) {
            toast.warning(
                "Please fill in all donation fields."
            );

            return;
        }

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            toast.warning(
                "Donation amount must be greater than zero."
            );

            return;
        }

        try {

            setLoading(true);

            const res = await api.post(
                "/donations",
                {
                    fullName,
                    phone,
                    amount,
                    date: form.date
                }
            );

            setForm({
                fullName: "",
                phone: "",
                amount: "",
                date: ""
            });

            if (refreshDashboard) {
                await refreshDashboard();
            }

            toast.success(
                res.data?.message ||
                "Donation added successfully."
            );

        } catch (err) {

            console.error(
                "Add donation error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Unable to add donation."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <style>
                {`
                    .afbros-form-card {
                        padding: 25px;
                        background: #fff;
                        border-radius: 15px;
                        height: 100%;
                    }

                    .afbros-form-heading {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 24px;
                    }

                    .afbros-form-heading-icon {
                        width: 42px;
                        height: 42px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 11px;
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .afbros-form-title {
                        margin: 0;
                        color: #25352d;
                        font-size: 18px;
                        font-weight: 700;
                    }

                    .afbros-form-subtitle {
                        margin: 3px 0 0;
                        color: #89948e;
                        font-size: 12px;
                    }

                    .afbros-form-label {
                        color: #56645c;
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .afbros-form-control {
                        min-height: 47px;
                        border: 1px solid #dfe6e2;
                        border-radius: 10px;
                        background: #fbfcfb;
                        box-shadow: none !important;
                    }

                    .afbros-form-control:focus {
                        border-color: #198754;
                        background: white;
                        box-shadow:
                            0 0 0 4px rgba(25,135,84,.08)
                            !important;
                    }

                    .afbros-submit-green {
                        min-height: 48px;
                        border: none;
                        border-radius: 10px;
                        background: #198754;
                        font-weight: 600;
                    }
                `}
            </style>

            <div className="afbros-form-card">

                <div className="afbros-form-heading">

                    <div className="afbros-form-heading-icon">
                        <FaHandHoldingHeart />
                    </div>

                    <div>

                        <h3 className="afbros-form-title">
                            Add Donation
                        </h3>

                        <p className="afbros-form-subtitle">
                            Record a new donation
                        </p>

                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label afbros-form-label">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            className="form-control afbros-form-control"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter donor name"
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label afbros-form-label">
                            Phone Number
                        </label>

                        <input
                            type="text"
                            name="phone"
                            className="form-control afbros-form-control"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label afbros-form-label">
                            Amount
                        </label>

                        <input
                            type="number"
                            name="amount"
                            min="1"
                            className="form-control afbros-form-control"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Enter donation amount"
                        />

                    </div>

                    <div className="mb-4">

                        <label className="form-label afbros-form-label">
                            Donation Date
                        </label>

                        <input
                            type="date"
                            name="date"
                            className="form-control afbros-form-control"
                            value={form.date}
                            onChange={handleChange}
                        />

                    </div>

                    <button
                        type="submit"
                        className="btn btn-success afbros-submit-green w-100"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Adding Donation...
                            </>
                        ) : (
                            "Add Donation"
                        )}

                    </button>

                </form>

            </div>
        </>
    );
}

export default DonationForm;