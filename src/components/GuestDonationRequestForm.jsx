import {
    useEffect,
    useState
} from "react";

import {
    FaPaperPlane,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaUniversity,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaShieldAlt
} from "react-icons/fa";

import api
    from "../api/api";

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

        fullName:
            "",

        phone:
            "",

        email:
            "",

        accountTitle:
            "",

        amount:
            "",

        transactionDate:
            ""

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
    // CHANGE
    // ==================================================

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        setForm(
            (
                current
            ) => ({

                ...current,

                [name]:
                    value

            })
        );

    };


    // ==================================================
    // NAME SUGGESTIONS
    // ==================================================

    useEffect(() => {

        const search =
            form.fullName
                .trim();


        if (!search) {

            setNameSuggestions(
                []
            );

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
                            search
                                .toLowerCase();


                        const names =
                            [];


                        const seen =
                            new Set();


                        for (
                            const donation
                            of res.data ||
                            []
                        ) {

                            const name =
                                donation
                                    .full_name
                                    ?.trim();


                            if (!name) {

                                continue;

                            }


                            const lowerName =
                                name
                                    .toLowerCase();


                            if (
                                !lowerName.includes(
                                    query
                                )
                            ) {

                                continue;

                            }


                            if (
                                seen.has(
                                    lowerName
                                )
                            ) {

                                continue;

                            }


                            seen.add(
                                lowerName
                            );


                            names.push(
                                name
                            );


                            if (
                                names.length >=
                                6
                            ) {

                                break;

                            }

                        }


                        setNameSuggestions(
                            names
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
            clearTimeout(
                timer
            );

    }, [
        form.fullName
    ]);


    // ==================================================
    // PHONE SUGGESTIONS
    // ==================================================

    useEffect(() => {

        const search =
            form.phone
                .trim();


        if (!search) {

            setPhoneSuggestions(
                []
            );

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


                        const phones =
                            [];


                        const seen =
                            new Set();


                        for (
                            const donation
                            of res.data ||
                            []
                        ) {

                            const phone =
                                donation
                                    .phone
                                    ?.trim();


                            if (
                                !phone ||
                                !phone.includes(
                                    search
                                )
                            ) {

                                continue;

                            }


                            if (
                                seen.has(
                                    phone
                                )
                            ) {

                                continue;

                            }


                            seen.add(
                                phone
                            );


                            phones.push(
                                phone
                            );


                            if (
                                phones.length >=
                                6
                            ) {

                                break;

                            }

                        }


                        setPhoneSuggestions(
                            phones
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
            clearTimeout(
                timer
            );

    }, [
        form.phone
    ]);


    // ==================================================
    // SUBMIT
    // ==================================================

    const handleSubmit =
        async (
            e
        ) => {

            e.preventDefault();


            const payload = {

                fullName:
                    form.fullName
                        .trim(),

                phone:
                    form.phone
                        .trim(),

                email:
                    form.email
                        .trim(),

                accountTitle:
                    form.accountTitle
                        .trim(),

                amount:
                    Number(
                        form.amount
                    ),

                transactionDate:
                    form.transactionDate

            };


            if (
                !payload.fullName ||
                !payload.phone ||
                !payload.email ||
                !payload.accountTitle ||
                !payload.transactionDate
            ) {

                toast.warning(
                    "Please complete all donation request fields."
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

                setLoading(
                    true
                );


                const res =
                    await api.post(
                        "/donations/requests",
                        payload
                    );


                toast.success(
                    res.data?.message ||
                    "Donation request submitted."
                );


                setForm({

                    fullName:
                        "",

                    phone:
                        "",

                    email:
                        "",

                    accountTitle:
                        "",

                    amount:
                        "",

                    transactionDate:
                        ""

                });


                setNameSuggestions(
                    []
                );


                setPhoneSuggestions(
                    []
                );


            } catch (
                err
            ) {

                console.error(err);


                toast.error(
                    err.response
                        ?.data
                        ?.message ||
                    "Unable to submit donation request."
                );


            } finally {

                setLoading(
                    false
                );

            }

        };


    return (
        <>

            <style>
                {`
                    .donation-request-card {
                        background: white;
                        border: 1px solid #e6ebe8;
                        border-radius: 18px;
                        box-shadow:
                            0 6px 22px
                            rgba(30,55,40,.05);
                        overflow: visible;
                    }

                    .donation-request-header {
                        padding: 22px 24px;
                        border-bottom:
                            1px solid #edf2ef;
                    }

                    .donation-request-body {
                        padding: 24px;
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

                    .request-suggestion-wrap {
                        position: relative;
                    }

                    .request-suggestions {
                        position: absolute;
                        top: calc(100% + 5px);
                        left: 0;
                        right: 0;
                        z-index: 100;
                        max-height: 220px;
                        overflow-y: auto;
                        background: white;
                        border:
                            1px solid #dfe7e2;
                        border-radius: 10px;
                        box-shadow:
                            0 12px 30px
                            rgba(25,48,35,.13);
                    }

                    .request-suggestion {
                        width: 100%;
                        padding: 11px 13px;
                        border: none;
                        border-bottom:
                            1px solid #eff3f0;
                        background: white;
                        text-align: left;
                        color: #34453c;
                        font-size: 13px;
                    }

                    .request-suggestion:hover {
                        background: #f2faf5;
                        color: #198754;
                    }

                    .request-suggestion:last-child {
                        border-bottom: none;
                    }
                `}
            </style>


            <div className="donation-request-card">

                <div className="donation-request-header">

                    <h4 className="fw-bold mb-1">
                        Submit Donation Request
                    </h4>

                    <small className="text-muted">
                        Submit transaction details for Finance Manager verification.
                    </small>

                </div>


                <div className="donation-request-body">

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >

                        <div className="row g-3">


                            {/* NAME */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    <FaUser className="me-2" />

                                    Full Name

                                </label>


                                <div className="request-suggestion-wrap">

                                    <input
                                        name="fullName"
                                        autoComplete="off"
                                        className="form-control request-control"
                                        placeholder="Enter full name"
                                        value={
                                            form.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    {nameSuggestions.length > 0 && (

                                        <div className="request-suggestions">

                                            {nameSuggestions.map(
                                                (
                                                    name
                                                ) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            name
                                                        }
                                                        className="request-suggestion"
                                                        onClick={() => {

                                                            setForm(
                                                                (
                                                                    current
                                                                ) => ({
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

                                    <FaPhone className="me-2" />

                                    Phone Number

                                </label>


                                <div className="request-suggestion-wrap">

                                    <input
                                        name="phone"
                                        autoComplete="off"
                                        className="form-control request-control"
                                        placeholder="Enter phone number"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    {phoneSuggestions.length > 0 && (

                                        <div className="request-suggestions">

                                            {phoneSuggestions.map(
                                                (
                                                    phone
                                                ) => (

                                                    <button
                                                        type="button"
                                                        key={
                                                            phone
                                                        }
                                                        className="request-suggestion"
                                                        onClick={() => {

                                                            setForm(
                                                                (
                                                                    current
                                                                ) => ({
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


                            {/* EMAIL */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    <FaEnvelope className="me-2" />

                                    Email

                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control request-control"
                                    placeholder="name@example.com"
                                    value={
                                        form.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* ACCOUNT TITLE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    <FaUniversity className="me-2" />

                                    Account Title

                                </label>

                                <input
                                    name="accountTitle"
                                    className="form-control request-control"
                                    placeholder="Transaction account title"
                                    value={
                                        form.accountTitle
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* AMOUNT */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    <FaMoneyBillWave className="me-2" />

                                    Amount

                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    name="amount"
                                    className="form-control request-control"
                                    placeholder="Donation amount"
                                    value={
                                        form.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>


                            {/* DATE */}

                            <div className="col-md-6">

                                <label className="form-label fw-semibold">

                                    <FaCalendarAlt className="me-2" />

                                    Transaction Date

                                </label>

                                <input
                                    type="date"
                                    name="transactionDate"
                                    className="form-control request-control"
                                    value={
                                        form.transactionDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                            </div>

                        </div>


                        <button
                            type="submit"
                            className="btn btn-success w-100 mt-4"
                            style={{
                                minHeight:
                                    "48px",
                                borderRadius:
                                    "10px",
                                fontWeight:
                                    600
                            }}
                            disabled={
                                loading
                            }
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


                        <div className="small text-muted mt-3">

                            <FaShieldAlt className="me-2" />

                            The donation is added to financial records only after Finance Manager acceptance.

                        </div>

                    </form>

                </div>

            </div>

        </>
    );

}


export default GuestDonationRequestForm;