import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/api";

function Expenses() {

    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, [search]);

    const fetchExpenses = async () => {

        try {

            const res = await api.get(`/expenses?search=${search}`);

            setExpenses(res.data);

        } catch (err) {

            console.log(err);

        }

    };
const openEditModal = (expense) => {

    setEditingExpense({
        ...expense,
        fullName: expense.full_name,
        date: expense.expense_date.substring(0, 10)
    });

};

const handleEditChange = (e) => {

    setEditingExpense({

        ...editingExpense,

        [e.target.name]: e.target.value

    });

};

const updateExpense = async () => {

    try {

        await api.put(
            `/expenses/${editingExpense.id}`,
            editingExpense
        );

        fetchExpenses();

        setEditingExpense(null);

        alert("Expense updated successfully.");

    } catch (err) {

        console.log(err);

        alert("Unable to update expense.");

    }

};

const deleteExpense = async (id) => {

    if (!window.confirm("Delete this expense?")) return;

    try {

        await api.delete(`/expenses/${id}`);

        fetchExpenses();

        alert("Expense deleted successfully.");

    } catch (err) {

        console.log(err);

        alert("Unable to delete expense.");

    }

};

    const totalExpense = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    return (

        <div className="container mt-5">

            <div className="card shadow mb-4">

                <div className="card-body text-center">

                    <h4>Total Expenses</h4>

                    <h2 className="text-danger">
                        Rs. {totalExpense.toLocaleString()}
                    </h2>

                </div>

            </div>

            <div className="mb-4">

                <input
                    className="form-control"
                    placeholder="Search by Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <table className="table table-bordered table-striped">

                <thead className="table-danger">

                    <tr>

                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th className="text-center">Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {expenses.map((expense) => (

                        <tr key={expense.id}>

                            <td>{expense.id}</td>

                            <td>{expense.full_name}</td>

                            <td>Rs. {expense.amount}</td>

                            <td>{expense.description}</td>

                            <td>{expense.expense_date?.substring(0,10)}</td>

<td className="text-center">

    <button
        className="btn btn-warning btn-sm me-2"
        onClick={() => openEditModal(expense)}
    >
        <FaEdit />
    </button>

    <button
        className="btn btn-danger btn-sm"
        onClick={() => deleteExpense(expense.id)}
    >
        <FaTrash />
    </button>

</td>

                            <td>

    <button
        className="btn btn-warning btn-sm me-2"
        onClick={() => openEditModal(expense)}
    >
        <FaEdit />
    </button>

    <button
        className="btn btn-danger btn-sm"
        onClick={() => deleteExpense(expense.id)}
    >
        <FaTrash />
    </button>

</td>
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default Expenses;