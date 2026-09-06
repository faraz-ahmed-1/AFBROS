import {
    FaEdit,
    FaTrash,
    FaSearch,
    FaMoneyBillWave,
    FaReceipt,
    FaChartLine,
    FaArrowUp,
    FaTimes
} from "react-icons/fa";

import {
    useEffect,
    useState
} from "react";

import api
    from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import ConfirmModal
    from "../components/ConfirmModal";

import {
    isFinanceManager
} from "../utils/auth";


function Expenses() {

    const toast =
        useToast();

    const manager =
        isFinanceManager();


    const [
        expenses,
        setExpenses
    ] = useState([]);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        editingExpense,
        setEditingExpense
    ] = useState(null);


    const [
        deleteTarget,
        setDeleteTarget
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        deleting,
        setDeleting
    ] = useState(false);


    // ==================================================
    // FETCH
    // ==================================================

    const fetchExpenses = async (
        showError = false
    ) => {

        try {

            setLoading(true);


            const res =
                await api.get(
                    `/expenses?search=${encodeURIComponent(
                        search
                    )}`
                );


            setExpenses(
                Array.isArray(
                    res.data
                )
                    ? res.data
                    : []
            );

        } catch (err) {

            console.error(err);


            if (showError) {

                toast.error(
                    err.response?.data?.message ||
                    "Unable to load expenses."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchExpenses(false);

    }, [search]);


    // ==================================================
    // EDIT
    // ==================================================

    const openEditModal = (
        expense
    ) => {

        if (!manager) {
            return;
        }


        setEditingExpense({

            id:
                expense.id,

            fullName:
                expense.full_name ||
                "",

            amount:
                expense.amount ||
                "",

            description:
                expense.description ||
                "",

            date:
                expense.expense_date
                    ?.substring(
                        0,
                        10
                    ) ||
                ""

        });

    };


    const handleEditChange = (
        e
    ) => {

        setEditingExpense(
            (current) => ({

                ...current,

                [e.target.name]:
                    e.target.value

            })
        );

    };


    const updateExpense =
        async () => {

            if (
                !manager ||
                !editingExpense
            ) {
                return;
            }


            const payload = {

                fullName:
                    editingExpense
                        .fullName
                        .trim(),

                amount:
                    Number(
                        editingExpense
                            .amount
                    ),

                description:
                    editingExpense
                        .description
                        .trim(),

                date:
                    editingExpense.date

            };


            if (
                !payload.fullName ||
                !payload.description ||
                !payload.date
            ) {

                toast.warning(
                    "Please fill in all expense fields."
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
                    "Expense amount must be greater than zero."
                );

                return;

            }


            try {

                setSaving(true);


                const res =
                    await api.put(
                        `/expenses/${editingExpense.id}`,
                        payload
                    );


                setEditingExpense(
                    null
                );


                await fetchExpenses(
                    false
                );


                toast.success(
                    res.data?.message ||
                    "Expense updated successfully."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to update expense."
                );

            } finally {

                setSaving(false);

            }

        };


    // ==================================================
    // DELETE
    // ==================================================

    const deleteExpense =
        async () => {

            if (
                !manager ||
                !deleteTarget
            ) {
                return;
            }


            try {

                setDeleting(true);


                const res =
                    await api.delete(
                        `/expenses/${deleteTarget.id}`
                    );


                setDeleteTarget(
                    null
                );


                await fetchExpenses(
                    false
                );


                toast.success(
                    res.data?.message ||
                    "Expense deleted successfully."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to delete expense."
                );

            } finally {

                setDeleting(false);

            }

        };


    // ==================================================
    // STATS
    // ==================================================

    const totalExpense =
        expenses.reduce(
            (
                sum,
                expense
            ) =>
                sum +
                Number(
                    expense.amount
                ),
            0
        );


    const averageExpense =
        expenses.length
            ? Math.round(
                totalExpense /
                expenses.length
            )
            : 0;


    const highestExpense =
        expenses.length
            ? Math.max(
                ...expenses.map(
                    (expense) =>
                        Number(
                            expense.amount
                        )
                )
            )
            : 0;


    return (
        <>

            <style>
                {`
                    .afbros-expenses-page {
                        min-height: 100vh;
                        background: #f5f7f6;
                        padding: 40px 0 65px;
                    }

                    .expenses-title {
                        margin: 0;
                        color: #202f27;
                        font-size: 28px;
                        font-weight: 700;
                    }

                    .expenses-subtitle {
                        margin: 5px 0 28px;
                        color: #849089;
                        font-size: 14px;
                    }

                    .readonly-notice {
                        margin-bottom: 22px;
                        padding: 13px 16px;
                        background: #fff8e5;
                        border:
                            1px solid #f0dfa9;
                        border-radius: 11px;
                        color: #796322;
                        font-size: 12px;
                    }

                    .expense-card,
                    .expense-stat-card {
                        background: white;
                        border:
                            1px solid #e7ece9;
                        border-radius: 17px;
                        box-shadow:
                            0 5px 20px
                            rgba(28,47,37,.045);
                    }

                    .expense-stat-card {
                        height: 100%;
                        padding: 23px;
                    }

                    .expense-stat-icon {
                        width: 42px;
                        height: 42px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 15px;
                        border-radius: 11px;
                    }

                    .expense-stat-red {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .expense-stat-blue {
                        background: #edf4ff;
                        color: #0d6efd;
                    }

                    .expense-stat-orange {
                        background: #fff6df;
                        color: #d98a00;
                    }

                    .expense-stat-purple {
                        background: #f1edfc;
                        color: #7654c6;
                    }

                    .expense-stat-label {
                        color: #849089;
                        font-size: 13px;
                    }

                    .expense-stat-value {
                        margin: 6px 0 0;
                        color: #25352d;
                        font-size: 24px;
                        font-weight: 700;
                    }

                    .expense-search-card {
                        margin-top: 25px;
                        padding: 20px;
                    }

                    .expense-search-wrap {
                        position: relative;
                    }

                    .expense-search-icon {
                        position: absolute;
                        left: 16px;
                        top: 50%;
                        transform:
                            translateY(-50%);
                        color: #99a49e;
                        z-index: 2;
                    }

                    .expense-search-input {
                        min-height: 47px;
                        padding-left: 44px;
                        border:
                            1px solid #dfe6e2;
                        border-radius: 10px;
                        background: #fbfcfb;
                        box-shadow:
                            none !important;
                    }

                    .expense-search-input:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .expense-table-card {
                        margin-top: 22px;
                        overflow: hidden;
                    }

                    .expense-table-heading {
                        padding: 20px 24px;
                        border-bottom:
                            1px solid #edf1ee;
                    }

                    .expense-table {
                        margin: 0;
                    }

                    .expense-table th {
                        padding: 14px 18px;
                        background: #f7faf8;
                        color: #68756e;
                        font-size: 12px;
                        text-transform: uppercase;
                        border: none;
                        border-bottom:
                            1px solid #e5ebe7;
                    }

                    .expense-table td {
                        padding: 16px 18px;
                        vertical-align: middle;
                        border-color: #eef1ef;
                    }

                    .expense-name {
                        font-weight: 600;
                    }

                    .expense-amount {
                        color: #dc3545 !important;
                        font-weight: 700;
                        white-space: nowrap;
                    }

                    .expense-action {
                        width: 35px;
                        height: 35px;
                        border: none;
                        border-radius: 8px;
                    }

                    .expense-edit {
                        background: #fff6de;
                        color: #d69500;
                    }

                    .expense-delete {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .expense-action:disabled {
                        opacity: .35;
                        cursor: not-allowed;
                    }

                    .expense-edit-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 1050;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        background:
                            rgba(13,25,18,.55);
                        backdrop-filter:
                            blur(3px);
                    }

                    .expense-edit-modal {
                        width: 100%;
                        max-width: 520px;
                        overflow: hidden;
                        background: white;
                        border-radius: 18px;
                        box-shadow:
                            0 30px 80px
                            rgba(0,0,0,.18);
                    }

                    .expense-edit-header,
                    .expense-edit-footer {
                        display: flex;
                        align-items: center;
                        justify-content:
                            space-between;
                        padding: 18px 24px;
                    }

                    .expense-edit-header {
                        border-bottom:
                            1px solid #edf1ee;
                    }

                    .expense-edit-footer {
                        justify-content:
                            flex-end;
                        gap: 10px;
                        border-top:
                            1px solid #edf1ee;
                    }

                    .expense-edit-body {
                        padding: 24px;
                    }

                    .expense-edit-control {
                        min-height: 46px;
                        border:
                            1px solid #dfe6e2;
                        border-radius: 10px;
                        box-shadow:
                            none !important;
                    }

                    .expense-edit-control:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    @media(max-width:767px) {
                        .afbros-expenses-page {
                            padding-top: 25px;
                        }

                        .expenses-title {
                            font-size: 24px;
                        }
                    }
                `}
            </style>


            <div className="afbros-expenses-page">

                <div className="container">

                    <h1 className="expenses-title">
                        Expenses
                    </h1>

                    <p className="expenses-subtitle">
                        View, search and manage AFBROS expenses.
                    </p>


                    {!manager && (

                        <div className="readonly-notice">

                            Guest Mode: Expense records are read-only. Edit and delete actions require Finance Manager access.

                        </div>

                    )}


                    <div className="row g-3">

                        <div className="col-xl-3 col-md-6">

                            <div className="expense-stat-card">

                                <div className="expense-stat-icon expense-stat-red">
                                    <FaMoneyBillWave />
                                </div>

                                <div className="expense-stat-label">
                                    Total Expenses
                                </div>

                                <h3 className="expense-stat-value">
                                    Rs. {totalExpense.toLocaleString()}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="expense-stat-card">

                                <div className="expense-stat-icon expense-stat-blue">
                                    <FaReceipt />
                                </div>

                                <div className="expense-stat-label">
                                    Expense Records
                                </div>

                                <h3 className="expense-stat-value">
                                    {expenses.length}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="expense-stat-card">

                                <div className="expense-stat-icon expense-stat-orange">
                                    <FaChartLine />
                                </div>

                                <div className="expense-stat-label">
                                    Average Expense
                                </div>

                                <h3 className="expense-stat-value">
                                    Rs. {averageExpense.toLocaleString()}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="expense-stat-card">

                                <div className="expense-stat-icon expense-stat-purple">
                                    <FaArrowUp />
                                </div>

                                <div className="expense-stat-label">
                                    Highest Expense
                                </div>

                                <h3 className="expense-stat-value">
                                    Rs. {highestExpense.toLocaleString()}
                                </h3>

                            </div>

                        </div>

                    </div>


                    <div className="expense-card expense-search-card">

                        <div className="expense-search-wrap">

                            <FaSearch className="expense-search-icon" />

                            <input
                                className="form-control expense-search-input"
                                placeholder="Search by name, description or amount..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="expense-card expense-table-card">

                        <div className="expense-table-heading">

                            <h5 className="fw-bold mb-1">
                                Expense Records
                            </h5>

                            <small className="text-muted">
                                {expenses.length} records found
                            </small>

                        </div>


                        <div className="table-responsive">

                            <table className="table expense-table">

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Full Name
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th className="text-center">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="text-center py-5"
                                            >
                                                <span className="spinner-border spinner-border-sm text-success me-2" />
                                                Loading expenses...
                                            </td>

                                        </tr>

                                    ) : expenses.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="text-center text-muted py-5"
                                            >
                                                No expenses found.
                                            </td>

                                        </tr>

                                    ) : (

                                        expenses.map(
                                            (expense) => (

                                                <tr key={expense.id}>

                                                    <td>
                                                        #{expense.id}
                                                    </td>

                                                    <td className="expense-name">
                                                        {expense.full_name}
                                                    </td>

                                                    <td className="expense-amount">

                                                        Rs.{" "}

                                                        {Number(
                                                            expense.amount
                                                        ).toLocaleString()}

                                                    </td>

                                                    <td>
                                                        {expense.description}
                                                    </td>

                                                    <td>
                                                        {expense.expense_date?.substring(0, 10)}
                                                    </td>

                                                    <td className="text-center">

                                                        <button
                                                            type="button"
                                                            className="expense-action expense-edit me-2"
                                                            disabled={!manager}
                                                            title={
                                                                manager
                                                                    ? "Edit expense"
                                                                    : "Finance Manager only"
                                                            }
                                                            onClick={() =>
                                                                openEditModal(
                                                                    expense
                                                                )
                                                            }
                                                        >
                                                            <FaEdit />
                                                        </button>


                                                        <button
                                                            type="button"
                                                            className="expense-action expense-delete"
                                                            disabled={!manager}
                                                            title={
                                                                manager
                                                                    ? "Delete expense"
                                                                    : "Finance Manager only"
                                                            }
                                                            onClick={() => {

                                                                if (manager) {

                                                                    setDeleteTarget(
                                                                        expense
                                                                    );

                                                                }

                                                            }}
                                                        >
                                                            <FaTrash />
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {manager &&
                        editingExpense && (

                        <div className="expense-edit-overlay">

                            <div className="expense-edit-modal">

                                <div className="expense-edit-header">

                                    <h5 className="m-0 fw-bold">
                                        Edit Expense
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        disabled={saving}
                                        onClick={() =>
                                            setEditingExpense(
                                                null
                                            )
                                        }
                                    >
                                        <FaTimes />
                                    </button>

                                </div>


                                <div className="expense-edit-body">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        name="fullName"
                                        className="form-control expense-edit-control mb-3"
                                        value={
                                            editingExpense.fullName
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />


                                    <label className="form-label">
                                        Amount
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        name="amount"
                                        className="form-control expense-edit-control mb-3"
                                        value={
                                            editingExpense.amount
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />


                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        rows="3"
                                        name="description"
                                        className="form-control expense-edit-control mb-3"
                                        value={
                                            editingExpense.description
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />


                                    <label className="form-label">
                                        Expense Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control expense-edit-control"
                                        value={
                                            editingExpense.date
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                </div>


                                <div className="expense-edit-footer">

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        disabled={saving}
                                        onClick={() =>
                                            setEditingExpense(
                                                null
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-success"
                                        disabled={saving}
                                        onClick={
                                            updateExpense
                                        }
                                    >

                                        {saving ? (

                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Saving...
                                            </>

                                        ) : (

                                            "Save Changes"

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    <ConfirmModal
                        show={
                            manager &&
                            Boolean(
                                deleteTarget
                            )
                        }
                        title="Delete Expense?"
                        message={
                            deleteTarget
                                ? `Permanently delete the expense recorded for ${deleteTarget.full_name}?`
                                : ""
                        }
                        confirmText="Delete Expense"
                        loading={deleting}
                        onCancel={() => {

                            if (!deleting) {

                                setDeleteTarget(
                                    null
                                );

                            }

                        }}
                        onConfirm={
                            deleteExpense
                        }
                    />

                </div>

            </div>

        </>
    );

}


export default Expenses;