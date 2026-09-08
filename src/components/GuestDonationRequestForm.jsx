import {
    useEffect,
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


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        form,
        setForm
    ] = useState({

        fullName: "",

        phone: "",

        trxId: "",

        amount: "",

        transactionDate: "",

        transactionTime: ""

    });


    const [
        nameSuggestions,
        setNameSuggestions
    ] = useState([]);


    const [
        phoneSuggestions,
        setPhoneSuggestions
    ] = useState([]);


    // ==================================================
    // INPUT
    // ==================================================

    const handleChange = (e) => {

        setForm(
            (current) => ({

                ...current,

                [e.target.name]:
                    e.target.value

            })
        );

    };


    // ==================================================
    // NAME SUGGESTIONS
    // ==================================================

    useEffect(() => {

        const search =
            form.fullName.trim();


        if (!search) {

            setNameSuggestions([]);

            return;
        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        const res =
                            await api.get(
                                "/donations",
                                {
                                    params: {
                                        search
                                    }
                                }
                            );


                        const query =
                            search.toLowerCase();


                        const unique = [];

                        const seen =
                            new Set();


                        for (
                            const donation
                            of res.data || []
                        ) {

                            const name =
                                donation.full_name
                                    ?.trim();


                            if (
                                !name ||
                                seen.has(name) ||
                                !name
                                    .toLowerCase()
                                    .includes(query)
                            ) {
                                continue;
                            }


                            seen.add(name);

                            unique.push(name);


                            if (
                                unique.length >=
                                6
                            ) {
                                break;
                            }

                        }


                        setNameSuggestions(
                            unique
                        );

                    } catch {

                        setNameSuggestions(
                            []
                        );

                    }

                },
                250
            );


        return () =>
            clearTimeout(timer);

    }, [form.fullName]);


    // ==================================================
    // PHONE SUGGESTIONS
    // ==================================================

    useEffect(() => {

        const search =
            form.phone.trim();


        if (!search) {

            setPhoneSuggestions([]);

            return;
        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        const res =
                            await api.get(
                                "/donations",
                                {
                                    params: {
                                        search
                                    }
                                }
                            );


                        const unique = [];

                        const seen =
                            new Set();


                        for (
                            const donation
                            of res.data || []
                        ) {

                            const phone =
                                donation.phone
                                    ?.trim();


                            if (
                                !phone ||
                                seen.has(phone) ||
                                !phone.includes(
                                    search
                                )
                            ) {
                                continue;
                            }


                            seen.add(phone);

                            unique.push(phone);


                            if (
                                unique.length >=
                                6
                            ) {
                                break;
                            }

                        }


                        setPhoneSuggestions(
                            unique
                        );

                    } catch {

                        setPhoneSuggestions(
                            []
                        );

                    }

                },
                250
            );


        return () =>
            clearTimeout(timer);

    }, [form.phone]);


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit =
        async (e) => {

            e.preventDefault();


            const payload = {

                fullName:
                    form.fullName.trim(),

                phone:
                    form.phone.trim(),

                trxId:
                    form.trxId.trim(),

                amount:
                    Number(
                        form.amount
                    ),

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


                setNameSuggestions([]);

                setPhoneSuggestions([]);


                window.dispatchEvent(
                    new Event(
                        "afbros-request-count-changed"
                    )
                );


            } catch (err) {

                console.error(err);


                toast.error(
                    err.response?.data?.message ||
                    "Unable to submit donation request."
                );


            } finally {

                setLoading(false);

            }

        };


    return (
        <>

            <style>
                {`
                    .request-form-card {
                        background: white;
                        border: 1px solid #dfe8e3;
                        border-radius: 18px;
                        overflow: visible;
                        box-shadow:
                            0 7px 25px
                            rgba(28,60,42,.05);
                    }

                    .request-form-header {
                        padding: 22px 25px;
                        display: flex;
                        align-items: center;
                        gap: 13px;
                        background:
                            linear-gradient(
                                135deg,
                                #f3faf6,
                                white
                            );
                        border-bottom:
                            1px solid #edf2ef;
                        border-radius:
                            18px 18px 0 0;
                    }

                    .request-form-icon {
                        width: 44px;
                        height: 44px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 12px;
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .request-form-title {
                        margin: 0;
                        color: #26372e;
                        font-size: 18px;
                        font-weight: 700;
                    }

                    .request-form-subtitle {
                        margin: 4px 0 0;
                        color: #85918a;
                        font-size: 12px;
                    }

                    .request-form-body {
                        padding: 25px;
                    }

                    .request-control {
                        min-height: 47px;
                        border:
                            1px solid #dfe6e2;
                        border-radius: 10px;
                        background: #fbfcfb;
                        box-shadow:
                            none !important;
                    }

                    .request-control:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .suggestion-wrapper {
                        position: relative;
                    }

                    .suggestion-menu {
                        position: absolute;
                        top: calc(100% + 5px);
                        left: 0;
                        right: 0;
                        z-index: 100;
                        max-height: 220px;
                        overflow-y: auto;
                        background: white;
                        border:
                            1px solid #dde7e1;
                        border-radius: 10px;
                        box-shadow:
                            0 12px 30px
                            rgba(25,48,35,.13);
                    }

                    .suggestion-item {
                        width: 100%;
                        padding: 11px 13px;
                        border: none;
                        border-bottom:
                            1px solid #f0f3f1;
                        background: white;
                        text-align: left;
                        color: #34453c;
                        font-size: 13px;
                    }

                    .suggestion-item:hover {
                        background: #f2faf5;
                        color: #198754;
                    }

                    .suggestion-item:last-child {
                        border-bottom: none;
                    }

                    .request-security-note {
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


            <div className="request-form-card">

                <div className="request-form-header">

                    <div className="request-form-icon">
                        <FaPaperPlane />
                    </div>

                    <div>

                        <h3 className="request-form-title">
                            Submit Donation Request
                        </h3>

                        <p className="request-form-subtitle">
                            Submit transaction details for Finance Manager verification.
                        </p>

                    </div>

                </div>


                <div className="request-form-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">


                            {/* NAME */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Full Name
                                </label>

                                <div className="suggestion-wrapper">

                                    <input
                                        name="fullName"
                                        autoComplete="off"
                                        className="form-control request-control"
                                        placeholder="Enter full name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                    />


                                    {nameSuggestions.length > 0 && (

                                        <div className="suggestion-menu">

                                            {nameSuggestions.map(
                                                (name) => (

                                                    <button
                                                        key={name}
                                                        type="button"
                                                        className="suggestion-item"
                                                        onClick={() => {

                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    fullName:
                                                                        name
                                                                })
                                                            );

                                                            setNameSuggestions(
                                                                []
                                                            );

                                                        }}
                                                    >
                                                        {name}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>


                            {/* PHONE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Phone Number
                                </label>

                                <div className="suggestion-wrapper">

                                    <input
                                        name="phone"
                                        autoComplete="off"
                                        className="form-control request-control"
                                        placeholder="Enter phone number"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />


                                    {phoneSuggestions.length > 0 && (

                                        <div className="suggestion-menu">

                                            {phoneSuggestions.map(
                                                (phone) => (

                                                    <button
                                                        key={phone}
                                                        type="button"
                                                        className="suggestion-item"
                                                        onClick={() => {

                                                            setForm(
                                                                (current) => ({
                                                                    ...current,
                                                                    phone
                                                                })
                                                            );

                                                            setPhoneSuggestions(
                                                                []
                                                            );

                                                        }}
                                                    >
                                                        {phone}
                                                    </button>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            </div>


                            <div className="col-md-6">

                                <label className="form-label fw-semibold">
                                    Transaction ID
                                </label>

                                <input
                                    name="trxId"
                                    className="form-control request-control"
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
                                    className="form-control request-control"
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
                                    className="form-control request-control"
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
                                    className="form-control request-control"
                                    value={form.transactionTime}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-success w-100 mt-4"
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
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane className="me-2" />
                                    Submit Request
                                </>
                            )}

                        </button>

                    </form>


                    <div className="request-security-note">

                        <FaShieldAlt />

                        Your request becomes an official donation only after Finance Manager acceptance.

                    </div>

                </div>

            </div>

        </>
    );

}


export default GuestDonationRequestForm;