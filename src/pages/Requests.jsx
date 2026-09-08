import {
    useEffect,
    useState
} from "react";

import {
    FaCheck,
    FaTimes,
    FaClock,
    FaClipboardList,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import api from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import ConfirmModal
    from "../components/ConfirmModal";

import GuestDonationRequestForm
    from "../components/GuestDonationRequestForm";

import {
    isFinanceManager
} from "../utils/auth";


function Requests() {

    const toast =
        useToast();

    const manager =
        isFinanceManager();


    const [
        requests,
        setRequests
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        processingId,
        setProcessingId
    ] = useState(null);


    const [
        rejectTarget,
        setRejectTarget
    ] = useState(null);


    // ==================================================
    // FETCH REQUESTS
    // ==================================================

    const fetchRequests =
        async () => {

            if (!manager) {
                return;
            }


            try {

                setLoading(true);


                const res =
                    await api.get(
                        "/donations/requests"
                    );


                setRequests(
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
                    "Unable to load donation requests."
                );


            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        fetchRequests();

    }, [manager]);


    // ==================================================
    // ACCEPT
    // ==================================================

    const acceptRequest =
        async (request) => {

            try {

                setProcessingId(
                    request.id
                );


                const res =
                    await api.post(
                        `/donations/requests/${request.id}/approve`
                    );


                await fetchRequests();


                window.dispatchEvent(
                    new Event(
                        "afbros-request-count-changed"
                    )
                );


                toast.success(
                    res.data?.message ||
                    "Request accepted."
                );


            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to accept request."
                );


            } finally {

                setProcessingId(
                    null
                );

            }

        };


    // ==================================================
    // REJECT
    // ==================================================

    const rejectRequest =
        async () => {

            if (!rejectTarget) {
                return;
            }


            try {

                setProcessingId(
                    rejectTarget.id
                );


                const res =
                    await api.post(
                        `/donations/requests/${rejectTarget.id}/reject`
                    );


                setRejectTarget(
                    null
                );


                await fetchRequests();


                window.dispatchEvent(
                    new Event(
                        "afbros-request-count-changed"
                    )
                );


                toast.success(
                    res.data?.message ||
                    "Request rejected."
                );


            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to reject request."
                );


            } finally {

                setProcessingId(
                    null
                );

            }

        };


    const pending =
        requests.filter(
            (item) =>
                item.status ===
                "pending"
        ).length;


    const accepted =
        requests.filter(
            (item) =>
                item.status ===
                "accepted"
        ).length;


    const rejected =
        requests.filter(
            (item) =>
                item.status ===
                "rejected"
        ).length;


    return (
        <>

            <style>
                {`
                    .requests-page {
                        min-height: 100vh;
                        background: #f5f7f6;
                        padding: 40px 0 70px;
                    }

                    .requests-title {
                        margin: 0;
                        color: #202f27;
                        font-size: 28px;
                        font-weight: 700;
                    }

                    .requests-subtitle {
                        margin: 5px 0 28px;
                        color: #87918c;
                        font-size: 14px;
                    }

                    .request-stat {
                        height: 100%;
                        padding: 21px;
                        background: white;
                        border:
                            1px solid #e6ebe8;
                        border-radius: 16px;
                    }

                    .request-stat-icon {
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 13px;
                        border-radius: 10px;
                    }

                    .request-stat.pending .request-stat-icon {
                        background: #fff6df;
                        color: #d98a00;
                    }

                    .request-stat.accepted .request-stat-icon {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .request-stat.rejected .request-stat-icon {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .request-stat.total .request-stat-icon {
                        background: #edf4ff;
                        color: #0d6efd;
                    }

                    .request-stat-label {
                        color: #859089;
                        font-size: 12px;
                    }

                    .request-stat-value {
                        margin: 5px 0 0;
                        color: #25352d;
                        font-size: 23px;
                        font-weight: 700;
                    }

                    .request-list-card {
                        margin-top: 25px;
                        overflow: hidden;
                        background: white;
                        border:
                            1px solid #e6ebe8;
                        border-radius: 17px;
                        box-shadow:
                            0 5px 20px
                            rgba(27,48,37,.045);
                    }

                    .request-list-header {
                        padding: 20px 24px;
                        border-bottom:
                            1px solid #edf1ee;
                    }

                    .request-table {
                        margin: 0;
                    }

                    .request-table th {
                        padding: 13px 15px;
                        background: #f7faf8;
                        color: #68756e;
                        border-bottom:
                            1px solid #e5ebe7;
                        font-size: 11px;
                        text-transform: uppercase;
                        white-space: nowrap;
                    }

                    .request-table td {
                        padding: 15px;
                        vertical-align: middle;
                        border-color: #eef2ef;
                        font-size: 13px;
                    }

                    .request-amount {
                        color: #198754;
                        font-weight: 700;
                        white-space: nowrap;
                    }

                    .request-action {
                        border: none;
                        border-radius: 8px;
                        padding: 8px 11px;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .accept-action {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .reject-action {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .decision-badge {
                        display: inline-flex;
                        align-items: center;
                        gap: 5px;
                        padding: 7px 10px;
                        border-radius: 30px;
                        font-size: 11px;
                        font-weight: 700;
                    }

                    .decision-accepted {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .decision-rejected {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .request-form-spacing {
                        margin-top: 25px;
                    }

                    @media(max-width:767px) {
                        .requests-page {
                            padding-top: 25px;
                        }

                        .requests-title {
                            font-size: 24px;
                        }
                    }
                `}
            </style>


            <div className="requests-page">

                <div className="container">

                    <h1 className="requests-title">
                        Donation Requests
                    </h1>

                    <p className="requests-subtitle">

                        {manager
                            ? "Review and manage submitted donation verification requests."
                            : "Submit your donation transaction for verification."}

                    </p>


                    {/* =================================
                        GUEST
                    ================================= */}

                    {!manager && (

                        <GuestDonationRequestForm />

                    )}


                    {/* =================================
                        MANAGER
                    ================================= */}

                    {manager && (

                        <>

                            <div className="row g-3">

                                <div className="col-lg-3 col-md-6">

                                    <div className="request-stat pending">

                                        <div className="request-stat-icon">
                                            <FaClock />
                                        </div>

                                        <div className="request-stat-label">
                                            Pending
                                        </div>

                                        <h3 className="request-stat-value">
                                            {pending}
                                        </h3>

                                    </div>

                                </div>


                                <div className="col-lg-3 col-md-6">

                                    <div className="request-stat accepted">

                                        <div className="request-stat-icon">
                                            <FaCheckCircle />
                                        </div>

                                        <div className="request-stat-label">
                                            Accepted
                                        </div>

                                        <h3 className="request-stat-value">
                                            {accepted}
                                        </h3>

                                    </div>

                                </div>


                                <div className="col-lg-3 col-md-6">

                                    <div className="request-stat rejected">

                                        <div className="request-stat-icon">
                                            <FaTimesCircle />
                                        </div>

                                        <div className="request-stat-label">
                                            Rejected
                                        </div>

                                        <h3 className="request-stat-value">
                                            {rejected}
                                        </h3>

                                    </div>

                                </div>


                                <div className="col-lg-3 col-md-6">

                                    <div className="request-stat total">

                                        <div className="request-stat-icon">
                                            <FaClipboardList />
                                        </div>

                                        <div className="request-stat-label">
                                            Total Requests
                                        </div>

                                        <h3 className="request-stat-value">
                                            {requests.length}
                                        </h3>

                                    </div>

                                </div>

                            </div>


                            <div className="request-list-card">

                                <div className="request-list-header">

                                    <h5 className="fw-bold mb-1">
                                        Request History
                                    </h5>

                                    <small className="text-muted">
                                        Pending, accepted and rejected requests
                                    </small>

                                </div>


                                <div className="table-responsive">

                                    <table className="table request-table">

                                        <thead>

                                            <tr>
                                                <th>Name</th>
                                                <th>Phone</th>
                                                <th>TRX ID</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Status / Decision</th>
                                            </tr>

                                        </thead>


                                        <tbody>

                                            {loading ? (

                                                <tr>

                                                    <td
                                                        colSpan="7"
                                                        className="text-center py-5"
                                                    >
                                                        <span className="spinner-border spinner-border-sm text-success me-2" />
                                                        Loading requests...
                                                    </td>

                                                </tr>

                                            ) : requests.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan="7"
                                                        className="text-center text-muted py-5"
                                                    >
                                                        No donation requests found.
                                                    </td>

                                                </tr>

                                            ) : (

                                                requests.map(
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

                                                            <td className="request-amount">
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

                                                            <td>

                                                                {request.status === "pending" && (

                                                                    <>

                                                                        <button
                                                                            type="button"
                                                                            className="request-action accept-action me-2"
                                                                            disabled={
                                                                                processingId ===
                                                                                request.id
                                                                            }
                                                                            onClick={() =>
                                                                                acceptRequest(
                                                                                    request
                                                                                )
                                                                            }
                                                                        >
                                                                            <FaCheck className="me-1" />
                                                                            Accept
                                                                        </button>


                                                                        <button
                                                                            type="button"
                                                                            className="request-action reject-action"
                                                                            disabled={
                                                                                processingId ===
                                                                                request.id
                                                                            }
                                                                            onClick={() =>
                                                                                setRejectTarget(
                                                                                    request
                                                                                )
                                                                            }
                                                                        >
                                                                            <FaTimes className="me-1" />
                                                                            Reject
                                                                        </button>

                                                                    </>

                                                                )}


                                                                {request.status === "accepted" && (

                                                                    <span className="decision-badge decision-accepted">

                                                                        <FaCheckCircle />

                                                                        Accepted

                                                                    </span>

                                                                )}


                                                                {request.status === "rejected" && (

                                                                    <span className="decision-badge decision-rejected">

                                                                        <FaTimesCircle />

                                                                        Rejected

                                                                    </span>

                                                                )}

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </>

                    )}


                    <ConfirmModal
                        show={
                            Boolean(
                                rejectTarget
                            )
                        }
                        title="Reject Donation Request?"
                        message={
                            rejectTarget
                                ? `Reject the donation request submitted by ${rejectTarget.full_name}?`
                                : ""
                        }
                        confirmText="Reject Request"
                        loading={
                            processingId ===
                            rejectTarget?.id
                        }
                        onCancel={() => {

                            if (!processingId) {

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


export default Requests;