import { useState } from "react";
import { FaReceipt } from "react-icons/fa";

import api from "../api/api";
import { useToast } from "../context/ToastContext";

function ExpenseForm({
    refreshDashboard
}) {

    const toast = useToast();

    const [form, setForm] = useState({
        fullName: "",
        amount: "",
        description: "",
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

        const description =
            form.description.trim();

        const amount =
            Number(form.amount);

        if (
            !fullName ||
            !description ||
            !form.date
        ) {
            toast.warning(
                "Please fill in all expense fields."
            );

            return;
        }

        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            toast.warning(
                "Expense amount must be greater than zero."
            );

            return;
        }

        try {

            setLoading(true);

            const res = await api.post(
                "/expenses",
                {
                    fullName,
                    amount,
                    description,
                    date: form.date
                }
            );

            setForm({
                fullName: "",
                amount: "",
                description: "",
                date: ""
            });

            if (refreshDashboard) {
                await refreshDashboard();
            }

            toast.success(
                res.data?.message ||
                "Expense added successfully."
            );

        } catch (err) {

            console.error(
                "Add expense error:",
                err
            );

            toast.error(
                err.response?.data?.message ||
                "Unable to add expense."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="afbros-form-card">

            <div className="afbros-form-heading">

                <div
                    className="afbros-form-heading-icon"
                    style={{
                        background: "#fff0f1",
                        color: "#dc3545"
                    }}
                >
                    <FaReceipt />
                </div>

                <div>

                    <h3 className="afbros-form-title">
                        Add Expense
                    </h3>

                    <p className="afbros-form-subtitle">
                        Record a new expense
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
                        placeholder="Enter name"
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
                        placeholder="Enter expense amount"
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label afbros-form-label">
                        Description
                    </label>

                    <textarea
                        name="description"
                        rows="2"
                        className="form-control afbros-form-control"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter expense description"
                    />

                </div>

                <div className="mb-4">

                    <label className="form-label afbros-form-label">
                        Expense Date
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
                    className="btn btn-danger w-100"
                    style={{
                        minHeight: "48px",
                        borderRadius: "10px",
                        fontWeight: 600
                    }}
                    disabled={loading}
                >

                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Adding Expense...
                        </>
                    ) : (
                        "Add Expense"
                    )}

                </button>

            </form>

        </div>
    );
}

export default ExpenseForm;