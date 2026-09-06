import {
    FaEdit,
    FaTrash,
    FaSearch,
    FaUsers,
    FaMoneyBillWave,
    FaChartLine,
    FaTrophy,
    FaFilter,
    FaTimes,
    FaCheck,
    FaBan,
    FaClock
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


function Depositors() {

    const toast =
        useToast();

    const manager =
        isFinanceManager();


    const [
        donations,
        setDonations
    ] = useState([]);


    const [
        pending,
        setPending
    ] = useState([]);


    const [
        search,
        setSearch
    ] = useState("");


    const [
        sort,
        setSort
    ] = useState("id");


    const [
        fromDate,
        setFromDate
    ] = useState("");


    const [
        toDate,
        setToDate
    ] = useState("");


    const [
        currentPage,
        setCurrentPage
    ] = useState(1);


    const [
        editingDonation,
        setEditingDonation
    ] = useState(null);


    const [
        deleteTarget,
        setDeleteTarget
    ] = useState(null);


    const [
        rejectTarget,
        setRejectTarget
    ] = useState(null);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        pendingLoading,
        setPendingLoading
    ] = useState(false);


    const [
        saving,
        setSaving
    ] = useState(false);


    const [
        deleting,
        setDeleting
    ] = useState(false);


    const [
        processingRequestId,
        setProcessingRequestId
    ] = useState(null);


    const recordsPerPage =
        10;


    // ==================================================
    // FETCH DONATIONS
    // ==================================================

    const fetchDonations = async (
        showError = false
    ) => {

        try {

            setLoading(true);


            const res =
                await api.get(
                    `/donations?search=${encodeURIComponent(
                        search
                    )}&sort=${sort}`
                );


            setDonations(
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
                    "Unable to load donations."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ==================================================
    // FETCH PENDING
    // ==================================================

    const fetchPending = async () => {

        if (!manager) {
            return;
        }


        try {

            setPendingLoading(
                true
            );


            const res =
                await api.get(
                    "/donations/requests"
                );


            setPending(
                Array.isArray(
                    res.data
                )
                    ? res.data
                    : []
            );

        } catch (err) {

            console.error(err);


            toast.error(
                err.response?.data?.message ||
                "Unable to load pending donations."
            );

        } finally {

            setPendingLoading(
                false
            );

        }

    };


    useEffect(() => {

        fetchDonations(false);

    }, [
        search,
        sort
    ]);


    useEffect(() => {

        if (manager) {
            fetchPending();
        }

    }, [manager]);


    useEffect(() => {

        setCurrentPage(1);

    }, [
        fromDate,
        toDate
    ]);


    // ==================================================
    // EDIT
    // ==================================================

    const openEditModal = (
        donation
    ) => {

        if (!manager) {
            return;
        }


        setEditingDonation({

            id:
                donation.id,

            fullName:
                donation.full_name ||
                "",

            phone:
                donation.phone ||
                "",

            amount:
                donation.amount ||
                "",

            date:
                donation.donation_date
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

        setEditingDonation(
            (current) => ({

                ...current,

                [e.target.name]:
                    e.target.value

            })
        );

    };


    const updateDonation =
        async () => {

            if (
                !manager ||
                !editingDonation
            ) {
                return;
            }


            const payload = {

                fullName:
                    editingDonation
                        .fullName
                        .trim(),

                phone:
                    editingDonation
                        .phone
                        .trim(),

                amount:
                    Number(
                        editingDonation
                            .amount
                    ),

                date:
                    editingDonation
                        .date

            };


            if (
                !payload.fullName ||
                !payload.phone ||
                !payload.date
            ) {

                toast.warning(
                    "Please fill in all donation fields."
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

                setSaving(true);


                const res =
                    await api.put(
                        `/donations/${editingDonation.id}`,
                        payload
                    );


                setEditingDonation(
                    null
                );


                await fetchDonations(
                    false
                );


                toast.success(
                    res.data?.message ||
                    "Donation updated successfully."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to update donation."
                );

            } finally {

                setSaving(false);

            }

        };


    // ==================================================
    // DELETE
    // ==================================================

    const deleteDonation =
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
                        `/donations/${deleteTarget.id}`
                    );


                setDeleteTarget(
                    null
                );


                await fetchDonations(
                    false
                );


                toast.success(
                    res.data?.message ||
                    "Donation deleted successfully."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to delete donation."
                );

            } finally {

                setDeleting(false);

            }

        };


    // ==================================================
    // APPROVE PENDING
    // ==================================================

    const approveRequest =
        async (request) => {

            if (!manager) {
                return;
            }


            try {

                setProcessingRequestId(
                    request.id
                );


                const res =
                    await api.post(
                        `/donations/requests/${request.id}/approve`
                    );


                await Promise.all([
                    fetchDonations(
                        false
                    ),
                    fetchPending()
                ]);


                toast.success(
                    res.data?.message ||
                    "Donation approved successfully."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to approve donation."
                );

            } finally {

                setProcessingRequestId(
                    null
                );

            }

        };


    // ==================================================
    // REJECT
    // ==================================================

    const rejectRequest =
        async () => {

            if (
                !manager ||
                !rejectTarget
            ) {
                return;
            }


            try {

                setProcessingRequestId(
                    rejectTarget.id
                );


                const res =
                    await api.delete(
                        `/donations/requests/${rejectTarget.id}/reject`
                    );


                setRejectTarget(
                    null
                );


                await fetchPending();


                toast.success(
                    res.data?.message ||
                    "Donation request rejected."
                );

            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to reject donation."
                );

            } finally {

                setProcessingRequestId(
                    null
                );

            }

        };


    // ==================================================
    // STATISTICS
    // ==================================================

    const totalAmount =
        donations.reduce(
            (
                sum,
                donation
            ) =>
                sum +
                Number(
                    donation.amount
                ),
            0
        );


    const groupedDonors =
        {};


    donations.forEach(
        (donation) => {

            const key =
                donation.phone?.trim() ||
                `record-${donation.id}`;


            if (
                !groupedDonors[key]
            ) {

                groupedDonors[key] = {

                    full_name:
                        donation.full_name,

                    phone:
                        donation.phone,

                    totalDonation:
                        0

                };

            }


            groupedDonors[
                key
            ].totalDonation +=
                Number(
                    donation.amount
                );

        }
    );


    const uniqueDonors =
        Object.keys(
            groupedDonors
        ).length;


    const topDonors =
        Object.values(
            groupedDonors
        )
            .sort(
                (a, b) =>
                    b.totalDonation -
                    a.totalDonation
            )
            .slice(
                0,
                5
            );


    const averageDonation =
        donations.length
            ? Math.round(
                totalAmount /
                donations.length
            )
            : 0;


    const highestDonation =
        donations.length
            ? Math.max(
                ...donations.map(
                    (donation) =>
                        Number(
                            donation.amount
                        )
                )
            )
            : 0;


    // ==================================================
    // DATE FILTER
    // ==================================================

    const filteredDonations =
        donations.filter(
            (donation) => {

                const date =
                    donation
                        .donation_date
                        ?.substring(
                            0,
                            10
                        );


                if (
                    fromDate &&
                    date < fromDate
                ) {
                    return false;
                }


                if (
                    toDate &&
                    date > toDate
                ) {
                    return false;
                }


                return true;

            }
        );


    // ==================================================
    // PAGINATION
    // ==================================================

    const totalPages =
        Math.ceil(
            filteredDonations.length /
            recordsPerPage
        );


    const firstIndex =
        (
            currentPage - 1
        ) *
        recordsPerPage;


    const currentDonations =
        filteredDonations.slice(
            firstIndex,
            firstIndex +
                recordsPerPage
        );


    useEffect(() => {

        const maxPage =
            Math.max(
                1,
                totalPages
            );


        if (
            currentPage >
            maxPage
        ) {

            setCurrentPage(
                maxPage
            );

        }

    }, [
        totalPages,
        currentPage
    ]);


    const clearFilters = () => {

        setSearch("");

        setSort("id");

        setFromDate("");

        setToDate("");

        setCurrentPage(1);

    };


    return (
        <>

            <style>
                {`
                    .donors-page {
                        min-height: 100vh;
                        background: #f5f7f6;
                        padding: 40px 0 70px;
                    }

                    .donors-title {
                        margin: 0;
                        color: #202f27;
                        font-size: 28px;
                        font-weight: 700;
                    }

                    .donors-subtitle {
                        margin: 5px 0 28px;
                        color: #87918c;
                        font-size: 14px;
                    }

                    .readonly-notice {
                        margin-bottom: 22px;
                        padding: 13px 16px;
                        background: #fff8e5;
                        border: 1px solid #f0dfa9;
                        border-radius: 11px;
                        color: #796322;
                        font-size: 12px;
                    }

                    .afbros-card,
                    .donor-stat {
                        background: white;
                        border: 1px solid #e6ebe8;
                        border-radius: 17px;
                        box-shadow:
                            0 5px 20px
                            rgba(27,48,37,.045);
                    }

                    .donor-stat {
                        height: 100%;
                        padding: 22px;
                    }

                    .stat-icon {
                        width: 42px;
                        height: 42px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 14px;
                        border-radius: 11px;
                    }

                    .stat-green {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .stat-blue {
                        background: #edf4ff;
                        color: #0d6efd;
                    }

                    .stat-orange {
                        background: #fff6df;
                        color: #d98a00;
                    }

                    .stat-purple {
                        background: #f1edfc;
                        color: #7654c6;
                    }

                    .stat-label {
                        color: #849089;
                        font-size: 13px;
                    }

                    .stat-value {
                        margin: 6px 0 0;
                        color: #25352d;
                        font-size: 24px;
                        font-weight: 700;
                    }

                    .top-card {
                        margin-top: 24px;
                        padding: 22px 24px;
                    }

                    .top-row {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom:
                            1px solid #eef2ef;
                    }

                    .top-row:last-child {
                        border: none;
                    }

                    .filter-card {
                        margin-top: 24px;
                        padding: 22px;
                    }

                    .donor-control {
                        min-height: 46px;
                        border:
                            1px solid #dfe6e2;
                        border-radius: 10px;
                        background: #fbfcfb;
                        box-shadow:
                            none !important;
                    }

                    .donor-control:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .search-wrap {
                        position: relative;
                    }

                    .search-wrap svg {
                        position: absolute;
                        top: 50%;
                        left: 15px;
                        z-index: 2;
                        transform:
                            translateY(-50%);
                        color: #96a198;
                    }

                    .search-wrap input {
                        padding-left: 42px;
                    }

                    .records-card,
                    .pending-card {
                        margin-top: 24px;
                        overflow: hidden;
                    }

                    .card-heading {
                        padding: 20px 24px;
                        border-bottom:
                            1px solid #edf1ee;
                    }

                    .donor-table {
                        margin: 0;
                    }

                    .donor-table th {
                        padding: 13px 16px;
                        background: #f7faf8;
                        color: #68756e;
                        border: none;
                        border-bottom:
                            1px solid #e5ebe7;
                        font-size: 11px;
                        text-transform: uppercase;
                        white-space: nowrap;
                    }

                    .donor-table td {
                        padding: 15px 16px;
                        border-color: #eef2ef;
                        vertical-align: middle;
                        font-size: 13px;
                    }

                    .donor-name {
                        font-weight: 600;
                    }

                    .donor-amount {
                        color: #198754 !important;
                        font-weight: 700;
                        white-space: nowrap;
                    }

                    .action-btn {
                        width: 35px;
                        height: 35px;
                        border: none;
                        border-radius: 8px;
                    }

                    .edit-btn {
                        background: #fff6de;
                        color: #d69500;
                    }

                    .delete-btn {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .action-btn:disabled {
                        opacity: .35;
                        cursor: not-allowed;
                    }

                    .pagination-area {
                        padding: 18px 24px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 12px;
                        border-top:
                            1px solid #edf1ee;
                    }

                    .pagination-area button {
                        padding: 8px 14px;
                        background: white;
                        color: #198754;
                        border:
                            1px solid #dce5e0;
                        border-radius: 9px;
                    }

                    .approve-btn,
                    .reject-btn {
                        border: none;
                        border-radius: 8px;
                        padding: 8px 12px;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .approve-btn {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .reject-btn {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .approve-btn:disabled,
                    .reject-btn:disabled {
                        opacity: .5;
                    }

                    .edit-overlay {
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

                    .edit-modal {
                        width: 100%;
                        max-width: 520px;
                        overflow: hidden;
                        background: white;
                        border-radius: 18px;
                        box-shadow:
                            0 30px 80px
                            rgba(0,0,0,.18);
                    }

                    .edit-header,
                    .edit-footer {
                        display: flex;
                        align-items: center;
                        justify-content:
                            space-between;
                        padding: 18px 24px;
                    }

                    .edit-header {
                        border-bottom:
                            1px solid #edf1ee;
                    }

                    .edit-footer {
                        justify-content:
                            flex-end;
                        gap: 10px;
                        border-top:
                            1px solid #edf1ee;
                    }

                    .edit-body {
                        padding: 24px;
                    }

                    @media(max-width:767px) {
                        .donors-page {
                            padding-top: 25px;
                        }

                        .donors-title {
                            font-size: 24px;
                        }

                        .pagination-area {
                            flex-wrap: wrap;
                        }
                    }
                `}
            </style>


            <div className="donors-page">

                <div className="container">

                    <h1 className="donors-title">
                        Donations & Donors
                    </h1>

                    <p className="donors-subtitle">
                        Monitor donations and manage donor records.
                    </p>


                    {!manager && (

                        <div className="readonly-notice">

                            Guest Mode: Donation records are read-only. Edit and delete actions require Finance Manager access.

                        </div>

                    )}


                    {/* STATS */}

                    <div className="row g-3">

                        <div className="col-xl-3 col-md-6">

                            <div className="donor-stat">

                                <div className="stat-icon stat-green">
                                    <FaMoneyBillWave />
                                </div>

                                <div className="stat-label">
                                    Total Donations
                                </div>

                                <h3 className="stat-value">
                                    Rs. {totalAmount.toLocaleString()}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="donor-stat">

                                <div className="stat-icon stat-blue">
                                    <FaUsers />
                                </div>

                                <div className="stat-label">
                                    Total Donors
                                </div>

                                <h3 className="stat-value">
                                    {uniqueDonors}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="donor-stat">

                                <div className="stat-icon stat-orange">
                                    <FaChartLine />
                                </div>

                                <div className="stat-label">
                                    Average Donation
                                </div>

                                <h3 className="stat-value">
                                    Rs. {averageDonation.toLocaleString()}
                                </h3>

                            </div>

                        </div>


                        <div className="col-xl-3 col-md-6">

                            <div className="donor-stat">

                                <div className="stat-icon stat-purple">
                                    <FaTrophy />
                                </div>

                                <div className="stat-label">
                                    Highest Donation
                                </div>

                                <h3 className="stat-value">
                                    Rs. {highestDonation.toLocaleString()}
                                </h3>

                            </div>

                        </div>

                    </div>


                    {/* TOP DONORS */}

                    <div className="afbros-card top-card">

                        <h5 className="fw-bold mb-3">

                            <FaTrophy className="me-2 text-warning" />

                            Top 5 Donors

                        </h5>


                        {topDonors.length === 0 ? (

                            <div className="text-muted">
                                No donor data available.
                            </div>

                        ) : (

                            topDonors.map(
                                (
                                    donor,
                                    index
                                ) => (

                                    <div
                                        key={
                                            donor.phone ||
                                            index
                                        }
                                        className="top-row"
                                    >

                                        <strong>
                                            #{index + 1}{" "}
                                            {donor.full_name}
                                        </strong>

                                        <strong className="text-success">
                                            Rs.{" "}
                                            {donor.totalDonation.toLocaleString()}
                                        </strong>

                                    </div>

                                )
                            )

                        )}

                    </div>


                    {/* FILTERS */}

                    <div className="afbros-card filter-card">

                        <div className="d-flex justify-content-between align-items-center mb-3">

                            <strong>

                                <FaFilter className="me-2" />

                                Search & Filters

                            </strong>

                            <button
                                type="button"
                                className="btn btn-link text-danger p-0 text-decoration-none"
                                onClick={clearFilters}
                            >
                                Clear
                            </button>

                        </div>


                        <div className="row g-3">

                            <div className="col-lg-5">

                                <div className="search-wrap">

                                    <FaSearch />

                                    <input
                                        className="form-control donor-control"
                                        placeholder="Search by name, phone or amount..."
                                        value={search}
                                        onChange={(e) => {

                                            setSearch(
                                                e.target.value
                                            );

                                            setCurrentPage(
                                                1
                                            );

                                        }}
                                    />

                                </div>

                            </div>


                            <div className="col-lg-2">

                                <input
                                    type="date"
                                    className="form-control donor-control"
                                    value={fromDate}
                                    onChange={(e) =>
                                        setFromDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="col-lg-2">

                                <input
                                    type="date"
                                    className="form-control donor-control"
                                    value={toDate}
                                    onChange={(e) =>
                                        setToDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div className="col-lg-3">

                                <select
                                    className="form-select donor-control"
                                    value={sort}
                                    onChange={(e) => {

                                        setSort(
                                            e.target.value
                                        );

                                        setCurrentPage(
                                            1
                                        );

                                    }}
                                >

                                    <option value="id">
                                        Default
                                    </option>

                                    <option value="amountAsc">
                                        Amount Low → High
                                    </option>

                                    <option value="amountDesc">
                                        Amount High → Low
                                    </option>

                                    <option value="dateNewest">
                                        Newest First
                                    </option>

                                    <option value="dateOldest">
                                        Oldest First
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    {/* APPROVED DONATIONS */}

                    <div className="afbros-card records-card">

                        <div className="card-heading">

                            <h5 className="fw-bold mb-1">
                                Donation Records
                            </h5>

                            <small className="text-muted">
                                {filteredDonations.length} records found
                            </small>

                        </div>


                        <div className="table-responsive">

                            <table className="table donor-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Full Name
                                        </th>

                                        <th>
                                            Phone
                                        </th>

                                        <th>
                                            Amount
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
                                                colSpan="5"
                                                className="text-center py-5"
                                            >

                                                <span className="spinner-border spinner-border-sm text-success me-2" />

                                                Loading donations...

                                            </td>

                                        </tr>

                                    ) : currentDonations.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center text-muted py-5"
                                            >

                                                No donation records found.

                                            </td>

                                        </tr>

                                    ) : (

                                        currentDonations.map(
                                            (donation) => (

                                                <tr key={donation.id}>

                                                    <td className="donor-name">
                                                        {donation.full_name}
                                                    </td>

                                                    <td>
                                                        {donation.phone}
                                                    </td>

                                                    <td className="donor-amount">

                                                        Rs.{" "}

                                                        {Number(
                                                            donation.amount
                                                        ).toLocaleString()}

                                                    </td>

                                                    <td>
                                                        {donation.donation_date?.substring(0, 10)}
                                                    </td>

                                                    <td className="text-center">

                                                        <button
                                                            type="button"
                                                            className="action-btn edit-btn me-2"
                                                            disabled={!manager}
                                                            title={
                                                                manager
                                                                    ? "Edit donation"
                                                                    : "Finance Manager only"
                                                            }
                                                            onClick={() =>
                                                                openEditModal(
                                                                    donation
                                                                )
                                                            }
                                                        >
                                                            <FaEdit />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-btn delete-btn"
                                                            disabled={!manager}
                                                            title={
                                                                manager
                                                                    ? "Delete donation"
                                                                    : "Finance Manager only"
                                                            }
                                                            onClick={() => {

                                                                if (manager) {

                                                                    setDeleteTarget(
                                                                        donation
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


                        {filteredDonations.length > 0 && (

                            <div className="pagination-area">

                                <button
                                    type="button"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                page - 1
                                        )
                                    }
                                >
                                    ← Previous
                                </button>


                                <span>

                                    Page{" "}

                                    <strong>
                                        {currentPage}
                                    </strong>

                                    {" "}of{" "}

                                    <strong>
                                        {totalPages || 1}
                                    </strong>

                                </span>


                                <button
                                    type="button"
                                    disabled={
                                        currentPage >=
                                        totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (page) =>
                                                page + 1
                                        )
                                    }
                                >
                                    Next →
                                </button>

                            </div>

                        )}

                    </div>


                    {/* PENDING REQUESTS */}

                    {manager && (

                        <div className="afbros-card pending-card">

                            <div className="card-heading">

                                <h5 className="fw-bold mb-1">

                                    <FaClock className="me-2 text-warning" />

                                    Pending Donation Verification

                                </h5>

                                <small className="text-muted">

                                    {pending.length} request

                                    {pending.length !== 1
                                        ? "s"
                                        : ""}

                                    {" "}awaiting review

                                </small>

                            </div>


                            <div className="table-responsive">

                                <table className="table donor-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Name
                                            </th>

                                            <th>
                                                Phone
                                            </th>

                                            <th>
                                                TRX ID
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Time
                                            </th>

                                            <th className="text-center">
                                                Decision
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {pendingLoading ? (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="text-center py-5"
                                                >

                                                    <span className="spinner-border spinner-border-sm text-success me-2" />

                                                    Loading pending requests...

                                                </td>

                                            </tr>

                                        ) : pending.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="7"
                                                    className="text-center text-muted py-5"
                                                >

                                                    No pending donation requests.

                                                </td>

                                            </tr>

                                        ) : (

                                            pending.map(
                                                (request) => (

                                                    <tr key={request.id}>

                                                        <td className="fw-semibold">
                                                            {request.full_name}
                                                        </td>

                                                        <td>
                                                            {request.phone}
                                                        </td>

                                                        <td className="fw-semibold">
                                                            {request.trx_id}
                                                        </td>

                                                        <td className="donor-amount">

                                                            Rs.{" "}

                                                            {Number(
                                                                request.amount
                                                            ).toLocaleString()}

                                                        </td>

                                                        <td>
                                                            {request.transaction_date?.substring(0, 10)}
                                                        </td>

                                                        <td>
                                                            {request.transaction_time?.substring(0, 5)}
                                                        </td>

                                                        <td className="text-center">

                                                            <button
                                                                type="button"
                                                                className="approve-btn me-2"
                                                                disabled={
                                                                    processingRequestId ===
                                                                    request.id
                                                                }
                                                                onClick={() =>
                                                                    approveRequest(
                                                                        request
                                                                    )
                                                                }
                                                            >

                                                                {processingRequestId === request.id ? (

                                                                    <span className="spinner-border spinner-border-sm" />

                                                                ) : (

                                                                    <>
                                                                        <FaCheck className="me-1" />
                                                                        Approve
                                                                    </>

                                                                )}

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="reject-btn"
                                                                disabled={
                                                                    processingRequestId ===
                                                                    request.id
                                                                }
                                                                onClick={() =>
                                                                    setRejectTarget(
                                                                        request
                                                                    )
                                                                }
                                                            >
                                                                <FaBan className="me-1" />
                                                                Reject
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

                    )}


                    {/* EDIT MODAL */}

                    {manager &&
                        editingDonation && (

                        <div className="edit-overlay">

                            <div className="edit-modal">

                                <div className="edit-header">

                                    <h5 className="fw-bold m-0">
                                        Edit Donation
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        disabled={saving}
                                        onClick={() =>
                                            setEditingDonation(
                                                null
                                            )
                                        }
                                    >
                                        <FaTimes />
                                    </button>

                                </div>


                                <div className="edit-body">

                                    <label className="form-label">
                                        Full Name
                                    </label>

                                    <input
                                        name="fullName"
                                        className="form-control donor-control mb-3"
                                        value={
                                            editingDonation.fullName
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />


                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        name="phone"
                                        className="form-control donor-control mb-3"
                                        value={
                                            editingDonation.phone
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
                                        className="form-control donor-control mb-3"
                                        value={
                                            editingDonation.amount
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />


                                    <label className="form-label">
                                        Donation Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control donor-control"
                                        value={
                                            editingDonation.date
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />

                                </div>


                                <div className="edit-footer">

                                    <button
                                        type="button"
                                        className="btn btn-light"
                                        disabled={saving}
                                        onClick={() =>
                                            setEditingDonation(
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
                                            updateDonation
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
                        title="Delete Donation?"
                        message={
                            deleteTarget
                                ? `Permanently delete the donation from ${deleteTarget.full_name}?`
                                : ""
                        }
                        confirmText="Delete Donation"
                        loading={deleting}
                        onCancel={() => {

                            if (!deleting) {

                                setDeleteTarget(
                                    null
                                );

                            }

                        }}
                        onConfirm={
                            deleteDonation
                        }
                    />


                    <ConfirmModal
                        show={
                            manager &&
                            Boolean(
                                rejectTarget
                            )
                        }
                        title="Reject Donation?"
                        message={
                            rejectTarget
                                ? `Reject the submitted donation from ${rejectTarget.full_name}? It will not be added to donation records.`
                                : ""
                        }
                        confirmText="Reject Request"
                        loading={
                            processingRequestId ===
                            rejectTarget?.id
                        }
                        onCancel={() => {

                            if (
                                !processingRequestId
                            ) {

                                setRejectTarget(
                                    null
                                );

                            }

                        }}
                        onConfirm={
                            rejectRequest
                        }
                    />

                </div>

            </div>

        </>
    );

}


export default Depositors;