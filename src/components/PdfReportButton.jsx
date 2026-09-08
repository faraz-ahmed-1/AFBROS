import {
    useState
} from "react";

import {
    useLocation
} from "react-router-dom";

import {
    FaFilePdf,
    FaTimes,
    FaCalendarAlt,
    FaDownload
} from "react-icons/fa";

import api
    from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import generateStatementPdf
    from "../utils/generateStatementPdf";


function PdfReportButton() {

    const location =
        useLocation();

    const toast =
        useToast();


    const [
        showModal,
        setShowModal
    ] = useState(false);


    const [
        downloading,
        setDownloading
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
    // REPORT TYPE BASED ON CURRENT PAGE
    // ==================================================

    let reportType =
        null;


    if (
        location.pathname === "/"
    ) {

        reportType =
            "all";

    }


    if (
        location.pathname ===
        "/depositors"
    ) {

        reportType =
            "in";

    }


    if (
        location.pathname ===
        "/expenses"
    ) {

        reportType =
            "out";

    }


    if (!reportType) {

        return null;

    }


    // ==================================================
    // INPUT CHANGE
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
    // CLEAR DATES
    // ==================================================

    const clearDates = () => {

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
    // BUILD VALID DATE
    // ==================================================

    const buildDate = (
        yearValue,
        monthValue,
        dayValue
    ) => {

        const year =
            Number(yearValue);

        const month =
            Number(monthValue);

        const day =
            Number(dayValue);


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
            `${String(year).padStart(
                4,
                "0"
            )}-${String(month).padStart(
                2,
                "0"
            )}-${String(day).padStart(
                2,
                "0"
            )}`
        );

    };


    // ==================================================
    // DOWNLOAD PDF
    // ==================================================

    const downloadPdf =
        async () => {

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


            // ==========================================
            // PARTIAL DATE ERROR
            // ==========================================

            if (
                filledCount > 0 &&
                filledCount < 6
            ) {

                toast.error(
                    "Complete all Day, Month and Year fields, or leave all fields empty for the complete statement."
                );

                return;

            }


            // ==========================================
            // CUSTOM RANGE
            // ==========================================

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


            // ==========================================
            // REQUEST REPORT
            // ==========================================

            try {

                setDownloading(
                    true
                );


                const params = {

                    type:
                        reportType

                };


                if (
                    from &&
                    to
                ) {

                    params.from =
                        from;

                    params.to =
                        to;

                }


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


                setShowModal(
                    false
                );


                clearDates();


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


    return (
        <>

            <style>
                {`
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
                            rgba(28,47,37,.04);
                    }

                    .pdf-download-btn:hover {
                        border-color: #198754;
                        background: #f4fbf7;
                    }


                    /* ===============================
                       MODAL
                    =============================== */

                    .pdf-modal-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 99990;

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        padding: 20px;

                        background:
                            rgba(12,24,17,.58);

                        backdrop-filter:
                            blur(4px);
                    }

                    .pdf-modal {
                        width: 100%;
                        max-width: 620px;

                        overflow: hidden;

                        background: white;

                        border-radius: 20px;

                        box-shadow:
                            0 30px 90px
                            rgba(0,0,0,.20);
                    }

                    .pdf-modal-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        padding: 20px 24px;

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

                        border: none;
                        border-radius: 9px;

                        background: #f3f6f4;

                        color: #748079;
                    }

                    .pdf-modal-body {
                        padding: 25px;
                    }


                    /* ===============================
                       DATE BOX
                    =============================== */

                    .date-section {
                        padding: 17px;

                        border:
                            1px solid #e6ece8;

                        border-radius: 13px;

                        background: #fafcfa;
                    }

                    .date-section-title {
                        display: flex;
                        align-items: center;
                        gap: 7px;

                        margin-bottom: 13px;

                        color: #36463d;

                        font-size: 13px;
                        font-weight: 700;
                    }

                    .date-input {
                        min-height: 45px;

                        border:
                            1px solid #dfe6e2;

                        border-radius: 9px;

                        background: white;

                        box-shadow:
                            none !important;
                    }

                    .date-input:focus {
                        border-color: #198754;

                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .pdf-help {
                        margin-top: 17px;

                        padding: 12px 14px;

                        border-radius: 10px;

                        background: #f3f8f5;

                        color: #718078;

                        font-size: 11px;
                        line-height: 1.6;
                    }

                    .pdf-modal-footer {
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

                        border-radius: 9px;

                        padding: 8px 16px;

                        font-size: 13px;
                        font-weight: 600;
                    }


                    @media(max-width:600px) {

                        .pdf-download-btn {
                            width: 100%;
                            justify-content: center;
                        }

                        .pdf-modal-body {
                            padding: 18px;
                        }

                    }
                `}
            </style>


            {/* ==========================================
                SAME BUTTON ON ALL PAGES
            ========================================== */}

            <div className="pdf-report-toolbar">

                <div className="container d-flex justify-content-end">

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


            {/* ==========================================
                DATE MODAL
            ========================================== */}

            {showModal && (

                <div className="pdf-modal-overlay">

                    <div className="pdf-modal">

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
                                        Select statement period
                                    </p>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="pdf-close-btn"
                                disabled={
                                    downloading
                                }
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                            >

                                <FaTimes />

                            </button>

                        </div>


                        <div className="pdf-modal-body">


                            {/* FROM DATE */}

                            <div className="date-section mb-3">

                                <div className="date-section-title">

                                    <FaCalendarAlt />

                                    From Date

                                </div>


                                <div className="row g-2">


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Day
                                        </label>

                                        <input
                                            name="fromDay"
                                            className="form-control date-input"
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


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Month
                                        </label>

                                        <input
                                            name="fromMonth"
                                            className="form-control date-input"
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


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Year
                                        </label>

                                        <input
                                            name="fromYear"
                                            className="form-control date-input"
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


                            {/* TO DATE */}

                            <div className="date-section">

                                <div className="date-section-title">

                                    <FaCalendarAlt />

                                    To Date

                                </div>


                                <div className="row g-2">


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Day
                                        </label>

                                        <input
                                            name="toDay"
                                            className="form-control date-input"
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


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Month
                                        </label>

                                        <input
                                            name="toMonth"
                                            className="form-control date-input"
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


                                    <div className="col-4">

                                        <label className="form-label small">
                                            Year
                                        </label>

                                        <input
                                            name="toYear"
                                            className="form-control date-input"
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


                            <div className="pdf-help">

                                <strong>
                                    Complete statement:
                                </strong>

                                {" "}

                                Leave all date fields empty to download all records from the beginning through today.

                                <br />


                                <strong>
                                    Custom statement:
                                </strong>

                                {" "}

                                Every Day, Month and Year field is required.

                            </div>

                        </div>


                        <div className="pdf-modal-footer">

                            <button
                                type="button"
                                className="btn btn-light"
                                disabled={
                                    downloading
                                }
                                onClick={
                                    clearDates
                                }
                            >

                                Clear Dates

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

                                        <span className="spinner-border spinner-border-sm me-2" />

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