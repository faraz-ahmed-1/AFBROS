import { useState } from "react";
import api from "../api/api";

function ExpenseForm({ refreshDashboard }) {

    const [expense, setExpense] = useState({
        fullName: "",
        amount: "",
        description: "",
        date: ""
    });

    const handleChange = (e) => {
        setExpense({
            ...expense,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post("/expenses", expense);

            await refreshDashboard();

            alert(response.data.message);

            setExpense({
                fullName: "",
                amount: "",
                description: "",
                date: ""
            });

        } catch (err) {

            console.error(err);
            alert("Failed to save expense.");

        }
    };

    return (
        <div className="card shadow border-0 h-100">

            <div className="card-header bg-danger text-white">
                <h4 className="mb-0">Add Expense</h4>
            </div>

            <div className="card-body">

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">
                        <label className="form-label">Full Name</label>

                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            placeholder="Enter full name"
                            value={expense.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Amount</label>

                        <input
                            type="number"
                            name="amount"
                            className="form-control"
                            placeholder="Enter amount"
                            value={expense.amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>

                        <textarea
                            name="description"
                            className="form-control"
                            rows="3"
                            placeholder="Enter description"
                            value={expense.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Date</label>

                        <input
                            type="date"
                            name="date"
                            className="form-control"
                            value={expense.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-danger w-100"
                    >
                        Save Expense
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ExpenseForm;