import {
    useEffect,
    useState
} from "react";

import {
    useLocation
} from "react-router-dom";

import {
    FaFilePdf,
    FaTimes,
    FaCalendarAlt,
    FaDownload,
    FaUser
} from "react-icons/fa";

import api
    from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import generateStatementPdf
    from "../utils/generateStatementPdf";

import {
    isFinanceManager
} from "../utils/auth";


function PdfReportButton() {

    const location =
        useLocation();

    const toast =
        useToast();

    const manager =
        isFinanceManager();


    // ==================================================
    // STATES
    // ==================================================

    const [
        showModal,
        setShowModal
    ] = useState(false);


    const [
        downloading,
        setDownloading
    ] = useState(false);


    const [
        donorName,
        setDonorName
    ] = useState("");


    const [
        donorSuggestions,
        setDonorSuggestions
    ] = useState([]);


    const [
        donorSearching,
        setDonorSearching
    ] = useState(false);


    const [
        donorSelected,
        setDonorSelected
    ] = useState(false);


    const [
        dates,
        setDates
    ] = useState({

        fromDay: "",
        fromMonth: "",
        fromYear: "",

        toDay: "",
        toMonth: "",
        toYear: ""

    });


    // ==================================================
    // NORMALIZE ROUTE
    // ==================================================

    const normalizedPath =
        location.pathname === "/"
            ? "/"
            : location.pathname.replace(
                /\/+$/,
                ""
            );


    // ==================================================
    // REPORT TYPE
    // ==================================================

    let reportType =
        null;


    // Dashboard = Complete Statement

    if (
        normalizedPath === "/"
    ) {

        reportType =
            "all";

    }


    // Donors = Donation Statement

    if (
        normalizedPath === "/depositors" ||
        normalizedPath === "/donors"
    ) {

        reportType =
            "in";

    }


    // Expenses = Expenses Statement

    if (
        normalizedPath === "/expenses"
    ) {

        reportType =
            "out";

    }


    // ==================================================
    // DONOR FILTER AVAILABILITY
    // ==================================================
    //
    // Donor field appears only on:
    //
    // Dashboard
    // Donation / Donors page
    //
    // Never on Expenses.
    // ==================================================

    const showDonorFilter =
        reportType === "all" ||
        reportType === "in";


    // ==================================================
    // DONOR SUGGESTIONS
    // ==================================================

    useEffect(() => {

        if (
            !manager ||
            !showDonorFilter
        ) {

            setDonorSuggestions([]);

            setDonorSearching(false);

            return;

        }


        const search =
            donorName.trim();


        if (!search) {

            setDonorSuggestions([]);

            setDonorSearching(false);

            setDonorSelected(false);

            return;

        }


        /*
            If donor has already been selected
            from the suggestions, don't reopen
            the dropdown immediately.
        */

        if (
            donorSelected
        ) {

            setDonorSearching(false);

            return;

        }


        const timer =
            setTimeout(
                async () => {

                    try {

                        setDonorSearching(
                            true
                        );


                        const res =
                            await api.get(
                                "/donations",
                                {
                                    params: {

                                        search,

                                        sort:
                                            "id"

                                    }
                                }
                            );


                        const query =
                            search.toLowerCase();


                        const uniqueNames =
                            [];


                        const seen =
                            new Set();


                        for (
                            const donation
                            of res.data || []
                        ) {

                            const name =
                                donation
                                    .full_name
                                    ?.trim();


                            if (!name) {

                                continue;

                            }


                            const lowerName =
                                name.toLowerCase();


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


                            uniqueNames.push(
                                name
                            );


                            if (
                                uniqueNames.length >=
                                7
                            ) {

                                break;

                            }

                        }


                        setDonorSuggestions(
                            uniqueNames
                        );


                    } catch (err) {

                        console.error(
                            "DONOR SUGGESTION ERROR:",
                            err
                        );


                        setDonorSuggestions(
                            []
                        );


                    } finally {

                        setDonorSearching(
                            false
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
        donorName,
        donorSelected,
        showDonorFilter,
        manager
    ]);


    // ==================================================
    // CLEAR DONOR WHEN ENTERING EXPENSES
    // ==================================================

    useEffect(() => {

        if (
            !showDonorFilter
        ) {

            setDonorName("");

            setDonorSelected(false);

            setDonorSuggestions([]);

            setDonorSearching(false);

        }

    }, [
        showDonorFilter
    ]);


    // ==================================================
    // RESET MODAL FILTERS WHEN PAGE CHANGES
    // ==================================================

    useEffect(() => {

        setShowModal(
            false
        );


        setDonorName(
            ""
        );


        setDonorSelected(
            false
        );


        setDonorSuggestions(
            []
        );


        setDonorSearching(
            false
        );


        setDates({

            fromDay: "",
            fromMonth: "",
            fromYear: "",

            toDay: "",
            toMonth: "",
            toYear: ""

        });

    }, [
        normalizedPath
    ]);


    // ==================================================
    // DONOR INPUT CHANGE
    // ==================================================

    const handleDonorChange = (
        e
    ) => {

        setDonorName(
            e.target.value
        );


        /*
            User manually modified the field,
            so it must be validated again.
        */

        setDonorSelected(
            false
        );

    };


    // ==================================================
    // SELECT DONOR
    // ==================================================

    const selectDonor = (
        name
    ) => {

        setDonorName(
            name
        );


        setDonorSelected(
            true
        );


        setDonorSuggestions(
            []
        );


        setDonorSearching(
            false
        );

    };


    // ==================================================
    // DATE INPUT CHANGE
    // ==================================================

    const handleChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;


        const numericValue =
            value.replace(
                /\D/g,
                ""
            );


        setDates(
            (current) => ({

                ...current,

                [name]:
                    numericValue

            })
        );

    };


    // ==================================================
    // CLEAR FILTERS
    // ==================================================

    const clearFilters = () => {

        setDonorName(
            ""
        );


        setDonorSelected(
            false
        );


        setDonorSuggestions(
            []
        );


        setDonorSearching(
            false
        );


        setDates({

            fromDay: "",
            fromMonth: "",
            fromYear: "",

            toDay: "",
            toMonth: "",
            toYear: ""

        });

    };


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    const closeModal = () => {

        if (
            downloading
        ) {

            return;

        }


        setShowModal(
            false
        );


        setDonorSuggestions(
            []
        );


        setDonorSearching(
            false
        );

    };


    // ==================================================
    // BUILD VALID DATE
    // ==================================================

    const buildDate = (
        yearValue,
        monthValue,
        dayValue
    ) => {

        const year =
            Number(
                yearValue
            );


        const month =
            Number(
                monthValue
            );


        const day =
            Number(
                dayValue
            );


        const date =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );


        if (
            date.getUTCFullYear() !==
                year ||

            date.getUTCMonth() !==
                month - 1 ||

            date.getUTCDate() !==
                day
        ) {

            return null;

        }


        return (
            `${String(
                year
            ).padStart(
                4,
                "0"
            )}-${String(
                month
            ).padStart(
                2,
                "0"
            )}-${String(
                day
            ).padStart(
                2,
                "0"
            )}`
        );

    };


    // ==================================================
    // VALIDATE DONOR
    // ==================================================

    const validateDonor =
        async () => {

            const enteredName =
                donorName.trim();


            // Empty donor is allowed.

            if (
                !showDonorFilter ||
                !enteredName
            ) {

                return {

                    valid:
                        true,

                    name:
                        ""

                };

            }


            try {

                const res =
                    await api.get(
                        "/donations",
                        {
                            params: {

                                search:
                                    enteredName,

                                sort:
                                    "id"

                            }
                        }
                    );


                const match =
                    (
                        res.data ||
                        []
                    ).find(
                        (
                            donation
                        ) => {

                            const currentName =
                                donation
                                    .full_name
                                    ?.trim();


                            if (
                                !currentName
                            ) {

                                return false;

                            }


                            return (
                                currentName
                                    .toLowerCase() ===
                                enteredName
                                    .toLowerCase()
                            );

                        }
                    );


                if (
                    !match
                ) {

                    return {

                        valid:
                            false,

                        name:
                            ""

                    };

                }


                return {

                    valid:
                        true,

                    name:
                        match
                            .full_name
                            .trim()

                };


            } catch (err) {

                console.error(
                    "DONOR VALIDATION ERROR:",
                    err
                );


                return {

                    valid:
                        false,

                    name:
                        ""

                };

            }

        };


    // ==================================================
    // DOWNLOAD PDF
    // ==================================================

    const downloadPdf =
        async () => {

            // ==================================================
            // DATE FIELD CHECK
            // ==================================================

            const values = [

                dates.fromDay,
                dates.fromMonth,
                dates.fromYear,

                dates.toDay,
                dates.toMonth,
                dates.toYear

            ];


            const filledCount =
                values.filter(
                    Boolean
                ).length;


            let from =
                null;


            let to =
                null;


            // ==================================================
            // PARTIAL DATE ERROR
            // ==================================================

            if (
                filledCount > 0 &&
                filledCount < 6
            ) {

                toast.error(
                    "Complete all Day, Month and Year fields, or leave all date fields empty."
                );

                return;

            }


            // ==================================================
            // CUSTOM DATE RANGE
            // ==================================================

            if (
                filledCount === 6
            ) {

                from =
                    buildDate(
                        dates.fromYear,
                        dates.fromMonth,
                        dates.fromDay
                    );


                to =
                    buildDate(
                        dates.toYear,
                        dates.toMonth,
                        dates.toDay
                    );


                if (
                    !from ||
                    !to
                ) {

                    toast.error(
                        "Please enter a valid date range."
                    );

                    return;

                }


                if (
                    from > to
                ) {

                    toast.error(
                        "From date cannot be after To date."
                    );

                    return;

                }

            }


            // ==================================================
            // VALIDATE DONOR
            // ==================================================

            let validDonorName =
                "";


            if (
                showDonorFilter &&
                donorName.trim()
            ) {

                const validation =
                    await validateDonor();


                if (
                    !validation.valid
                ) {

                    toast.error(
                        "Donor name was not found. Please select a valid donor from the suggestions."
                    );

                    return;

                }


                validDonorName =
                    validation.name;


                setDonorName(
                    validation.name
                );


                setDonorSelected(
                    true
                );

            }


            // ==================================================
            // EFFECTIVE REPORT TYPE
            // ==================================================
            //
            // Dashboard without donor:
            //     Complete Statement
            //
            // Dashboard with donor:
            //     Donation Statement
            //
            // Donors:
            //     Donation Statement
            //
            // Expenses:
            //     Expenses Statement
            // ==================================================

            const effectiveReportType =
                reportType === "all" &&
                validDonorName
                    ? "in"
                    : reportType;


            // ==================================================
            // BUILD PARAMS
            // ==================================================

            const params = {

                type:
                    effectiveReportType

            };


            if (
                validDonorName
            ) {

                params.donor =
                    validDonorName;

            }


            if (
                from &&
                to
            ) {

                params.from =
                    from;

                params.to =
                    to;

            }


            // ==================================================
            // REQUEST + GENERATE
            // ==================================================

            try {

                setDownloading(
                    true
                );


                const res =
                    await api.get(
                        "/reports/statement",
                        {
                            params
                        }
                    );


                generateStatementPdf(
                    res.data
                );


                toast.success(
                    "PDF statement downloaded successfully."
                );


                clearFilters();


                setShowModal(
                    false
                );


            } catch (err) {

                console.error(
                    "PDF DOWNLOAD ERROR:",
                    err
                );


                toast.error(
                    err.response?.data?.message ||
                    "Unable to generate PDF statement."
                );


            } finally {

                setDownloading(
                    false
                );

            }

        };


    // ==================================================
    // FINANCE MANAGER ONLY
    // ==================================================
    //
    // Kept AFTER hooks to avoid conditional
    // React hook execution.
    // ==================================================

    if (
        !manager ||
        !reportType
    ) {

        return null;

    }


    // ==================================================
    // UI
    // ==================================================

    return (
        <>

            <style>
                {`

                    /* =================================
                       TOOLBAR
                    ================================= */

                    .pdf-report-toolbar {
                        background: #f5f7f6;
                        padding: 15px 0 0;
                    }


                    .pdf-download-btn {
                        display: flex;
                        align-items: center;
                        gap: 8px;

                        min-height: 41px;

                        padding: 9px 15px;

                        border:
                            1px solid #dbe5df;

                        border-radius: 10px;

                        background: white;

                        color: #198754;

                        font-size: 13px;

                        font-weight: 600;

                        box-shadow:
                            0 3px 12px
                            rgba(
                                28,
                                47,
                                37,
                                .04
                            );

                        transition:
                            .2s ease;
                    }


                    .pdf-download-btn:hover {
                        border-color: #198754;
                        background: #f4fbf7;
                    }


                    /* =================================
                       OVERLAY
                    ================================= */

                    .pdf-modal-overlay {
                        position: fixed;
                        inset: 0;

                        z-index: 99990;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        padding: 20px;

                        background:
                            rgba(
                                12,
                                24,
                                17,
                                .58
                            );

                        backdrop-filter:
                            blur(4px);
                    }


                    /* =================================
                       MODAL
                    ================================= */

                    .pdf-modal {
                        width: 100%;
                        max-width: 620px;

                        max-height:
                            calc(
                                100vh - 40px
                            );

                        overflow-y: auto;

                        background: white;

                        border-radius: 20px;

                        box-shadow:
                            0 30px 90px
                            rgba(
                                0,
                                0,
                                0,
                                .20
                            );
                    }


                    /* =================================
                       HEADER
                    ================================= */

                    .pdf-modal-header {
                        position: sticky;
                        top: 0;

                        z-index: 20;

                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        padding: 20px 24px;

                        background: white;

                        border-bottom:
                            1px solid #edf1ee;
                    }


                    .pdf-header-left {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }


                    .pdf-header-icon {
                        width: 43px;
                        height: 43px;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        flex-shrink: 0;

                        border-radius: 11px;

                        background: #fff0f1;

                        color: #dc3545;

                        font-size: 18px;
                    }


                    .pdf-modal-title {
                        margin: 0;

                        color: #26372e;

                        font-size: 18px;

                        font-weight: 700;
                    }


                    .pdf-modal-subtitle {
                        margin: 3px 0 0;

                        color: #87938c;

                        font-size: 11px;
                    }


                    .pdf-close-btn {
                        width: 36px;
                        height: 36px;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        border: none;

                        border-radius: 9px;

                        background: #f3f6f4;

                        color: #748079;
                    }


                    .pdf-close-btn:hover:not(:disabled) {
                        background: #e9eeeb;
                    }


                    /* =================================
                       BODY
                    ================================= */

                    .pdf-modal-body {
                        padding: 25px;
                    }


                    /* =================================
                       FILTER CARD
                    ================================= */

                    .pdf-filter-section {
                        padding: 17px;

                        border:
                            1px solid #e6ece8;

                        border-radius: 13px;

                        background: #fafcfa;
                    }


                    .pdf-filter-title {
                        display: flex;
                        align-items: center;
                        gap: 7px;

                        margin-bottom: 13px;

                        color: #36463d;

                        font-size: 13px;

                        font-weight: 700;
                    }


                    .pdf-input {
                        min-height: 45px;

                        border:
                            1px solid #dfe6e2;

                        border-radius: 9px;

                        background: white;

                        box-shadow:
                            none !important;
                    }


                    .pdf-input:focus {
                        border-color: #198754;

                        box-shadow:
                            0 0 0 4px
                            rgba(
                                25,
                                135,
                                84,
                                .08
                            )
                            !important;
                    }


                    /* =================================
                       DONOR SUGGESTIONS
                    ================================= */

                    .pdf-donor-wrapper {
                        position: relative;
                    }


                    .pdf-donor-suggestions {
                        position: absolute;

                        top:
                            calc(
                                100% + 5px
                            );

                        left: 0;
                        right: 0;

                        z-index: 100;

                        max-height: 230px;

                        overflow-y: auto;

                        background: white;

                        border:
                            1px solid #dce6e0;

                        border-radius: 10px;

                        box-shadow:
                            0 12px 30px
                            rgba(
                                25,
                                48,
                                35,
                                .14
                            );
                    }


                    .pdf-donor-option {
                        width: 100%;

                        display: flex;
                        align-items: center;
                        gap: 9px;

                        padding: 11px 13px;

                        border: none;

                        border-bottom:
                            1px solid #eff3f0;

                        background: white;

                        color: #34453c;

                        text-align: left;

                        font-size: 13px;
                    }


                    .pdf-donor-option:hover {
                        background: #f2faf5;
                        color: #198754;
                    }


                    .pdf-donor-option:last-child {
                        border-bottom: none;
                    }


                    .pdf-searching {
                        padding: 11px 13px;

                        color: #87938c;

                        font-size: 12px;
                    }


                    /* =================================
                       HELP BOX
                    ================================= */

                    .pdf-help {
                        margin-top: 17px;

                        padding: 12px 14px;

                        border-radius: 10px;

                        background: #f3f8f5;

                        color: #718078;

                        font-size: 11px;

                        line-height: 1.65;
                    }


                    /* =================================
                       FOOTER
                    ================================= */

                    .pdf-modal-footer {
                        position: sticky;
                        bottom: 0;

                        z-index: 20;

                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;

                        padding: 17px 24px;

                        border-top:
                            1px solid #edf1ee;

                        background: #fafbfa;
                    }


                    .pdf-modal-footer button {
                        min-height: 43px;

                        padding: 8px 16px;

                        border-radius: 9px;

                        font-size: 13px;

                        font-weight: 600;
                    }


                    /* =================================
                       MOBILE
                    ================================= */

                    @media(
                        max-width: 600px
                    ) {

                        .pdf-download-btn {
                            width: 100%;
                            justify-content: center;
                        }


                        .pdf-modal-overlay {
                            padding: 12px;
                        }


                        .pdf-modal {
                            max-height:
                                calc(
                                    100vh - 24px
                                );
                        }


                        .pdf-modal-body {
                            padding: 18px;
                        }


                        .pdf-modal-header {
                            padding: 17px 18px;
                        }


                        .pdf-modal-footer {
                            padding: 14px 18px;
                        }

                    }

                `}
            </style>


            {/* =========================================
                DOWNLOAD BUTTON
            ========================================= */}

            <div className="pdf-report-toolbar">

                <div
                    className="
                        container
                        d-flex
                        justify-content-end
                    "
                >

                    <button
                        type="button"
                        className="pdf-download-btn"
                        onClick={() =>
                            setShowModal(
                                true
                            )
                        }
                    >

                        <FaFilePdf />

                        Download Statement

                    </button>

                </div>

            </div>


            {/* =========================================
                MODAL
            ========================================= */}

            {showModal && (

                <div className="pdf-modal-overlay">

                    <div className="pdf-modal">


                        {/* =================================
                            HEADER
                        ================================= */}

                        <div className="pdf-modal-header">

                            <div className="pdf-header-left">

                                <div className="pdf-header-icon">

                                    <FaFilePdf />

                                </div>


                                <div>

                                    <h3 className="pdf-modal-title">

                                        Download Statement

                                    </h3>


                                    <p className="pdf-modal-subtitle">

                                        Select statement filters

                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="pdf-close-btn"
                                disabled={
                                    downloading
                                }
                                onClick={
                                    closeModal
                                }
                            >

                                <FaTimes />

                            </button>

                        </div>


                        {/* =================================
                            BODY
                        ================================= */}

                        <div className="pdf-modal-body">


                            {/* =================================
                                DONOR FILTER

                                Dashboard + Donors only
                            ================================= */}

                            {showDonorFilter && (

                                <div className="pdf-filter-section mb-3">

                                    <div className="pdf-filter-title">

                                        <FaUser />

                                        Donor Name

                                        <span className="text-muted fw-normal">

                                            (Optional)

                                        </span>

                                    </div>


                                    <div className="pdf-donor-wrapper">

                                        <input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control pdf-input"
                                            placeholder="Start typing donor name..."
                                            value={
                                                donorName
                                            }
                                            onChange={
                                                handleDonorChange
                                            }
                                        />


                                        {/* SEARCHING */}

                                        {donorSearching &&
                                            donorName.trim() &&
                                            !donorSelected && (

                                            <div className="pdf-donor-suggestions">

                                                <div className="pdf-searching">

                                                    Searching donors...

                                                </div>

                                            </div>

                                        )}


                                        {/* RESULTS */}

                                        {!donorSearching &&
                                            donorSuggestions.length > 0 &&
                                            !donorSelected && (

                                            <div className="pdf-donor-suggestions">

                                                {donorSuggestions.map(
                                                    (
                                                        name
                                                    ) => (

                                                        <button
                                                            key={
                                                                name
                                                            }
                                                            type="button"
                                                            className="pdf-donor-option"
                                                            onClick={() =>
                                                                selectDonor(
                                                                    name
                                                                )
                                                            }
                                                        >

                                                            <FaUser />

                                                            {name}

                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                </div>

                            )}


                            {/* =================================
                                FROM DATE
                            ================================= */}

                            <div className="pdf-filter-section mb-3">

                                <div className="pdf-filter-title">

                                    <FaCalendarAlt />

                                    From Date

                                </div>


                                <div className="row g-2">


                                    {/* DAY */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Day

                                        </label>


                                        <input
                                            name="fromDay"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="DD"
                                            maxLength="2"
                                            value={
                                                dates.fromDay
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* MONTH */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Month

                                        </label>


                                        <input
                                            name="fromMonth"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="MM"
                                            maxLength="2"
                                            value={
                                                dates.fromMonth
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* YEAR */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Year

                                        </label>


                                        <input
                                            name="fromYear"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="YYYY"
                                            maxLength="4"
                                            value={
                                                dates.fromYear
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================
                                TO DATE
                            ================================= */}

                            <div className="pdf-filter-section">

                                <div className="pdf-filter-title">

                                    <FaCalendarAlt />

                                    To Date

                                </div>


                                <div className="row g-2">


                                    {/* DAY */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Day

                                        </label>


                                        <input
                                            name="toDay"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="DD"
                                            maxLength="2"
                                            value={
                                                dates.toDay
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* MONTH */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Month

                                        </label>


                                        <input
                                            name="toMonth"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="MM"
                                            maxLength="2"
                                            value={
                                                dates.toMonth
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    {/* YEAR */}

                                    <div className="col-4">

                                        <label className="form-label small">

                                            Year

                                        </label>


                                        <input
                                            name="toYear"
                                            inputMode="numeric"
                                            className="form-control pdf-input"
                                            placeholder="YYYY"
                                            maxLength="4"
                                            value={
                                                dates.toYear
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================
                                HELP
                            ================================= */}

                            <div className="pdf-help">

                                {showDonorFilter && (

                                    <>

                                        <strong>
                                            Donor Name:
                                        </strong>

                                        {" "}

                                        Optional. If entered, it must match an existing donor. Select a donor from the suggestions.

                                        <br />

                                    </>

                                )}


                                <strong>
                                    Complete History:
                                </strong>

                                {" "}

                                Leave all Day, Month and Year fields empty.

                                <br />


                                <strong>
                                    Custom Period:
                                </strong>

                                {" "}

                                All six Day, Month and Year fields are required.

                            </div>

                        </div>


                        {/* =================================
                            FOOTER
                        ================================= */}

                        <div className="pdf-modal-footer">

                            <button
                                type="button"
                                className="btn btn-light"
                                disabled={
                                    downloading
                                }
                                onClick={
                                    clearFilters
                                }
                            >

                                Clear Filters

                            </button>


                            <button
                                type="button"
                                className="btn btn-success"
                                disabled={
                                    downloading
                                }
                                onClick={
                                    downloadPdf
                                }
                            >

                                {downloading ? (

                                    <>

                                        <span
                                            className="
                                                spinner-border
                                                spinner-border-sm
                                                me-2
                                            "
                                        />

                                        Generating...

                                    </>

                                ) : (

                                    <>

                                        <FaDownload className="me-2" />

                                        Download PDF

                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );

}


export default PdfReportButton;