import {
    useState
} from "react";

import {
    FaEnvelope,
    FaUserEdit,
    FaShieldAlt,
    FaKey,
    FaCheckCircle
} from "react-icons/fa";

import api
    from "../api/api";

import {
    useToast
} from "../context/ToastContext";


function DonorDetailsUpdateForm() {

    const toast =
        useToast();


    const [
        form,
        setForm
    ] = useState({

        currentEmail:
            "",

        fullName:
            "",

        phone:
            "",

        email:
            ""

    });


    const [
        otp,
        setOtp
    ] = useState("");


    const [
        otpRequestId,
        setOtpRequestId
    ] = useState(null);


    const [
        sentTo,
        setSentTo
    ] = useState("");


    const [
        sending,
        setSending
    ] = useState(false);


    const [
        verifying,
        setVerifying
    ] = useState(false);


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
    // HAS CHANGE
    // ==================================================

    const hasChanges =
        Boolean(

            form.fullName.trim() ||

            form.phone.trim() ||

            form.email.trim()

        );


    const canRequestOtp =
        Boolean(
            form.currentEmail.trim() &&
            hasChanges &&
            !sending
        );


    // ==================================================
    // REQUEST OTP
    // ==================================================

    const requestOtp =
        async () => {

            if (
                !canRequestOtp
            ) {

                return;

            }


            try {

                setSending(
                    true
                );


                const res =
                    await api.post(
                        "/donor-profile/update/request-otp",
                        {

                            currentEmail:
                                form.currentEmail
                                    .trim(),

                            fullName:
                                form.fullName
                                    .trim(),

                            phone:
                                form.phone
                                    .trim(),

                            email:
                                form.email
                                    .trim()

                        }
                    );


                setOtpRequestId(
                    res.data
                        .otpRequestId
                );


                setSentTo(
                    res.data
                        .sentTo ||
                    ""
                );


                setOtp(
                    ""
                );


                toast.success(
                    res.data?.message ||
                    "OTP sent successfully."
                );


            } catch (
                err
            ) {

                console.error(err);


                toast.error(
                    err.response
                        ?.data
                        ?.message ||
                    "Unable to send OTP."
                );


            } finally {

                setSending(
                    false
                );

            }

        };


    // ==================================================
    // VERIFY
    // ==================================================

    const verifyOtp =
        async () => {

            if (
                !otpRequestId ||
                otp.length !== 6
            ) {

                return;

            }


            try {

                setVerifying(
                    true
                );


                const res =
                    await api.post(
                        "/donor-profile/update/verify-otp",
                        {

                            otpRequestId,

                            otp

                        }
                    );


                toast.success(
                    res.data?.message ||
                    "Donor details updated."
                );


                setForm({

                    currentEmail:
                        "",

                    fullName:
                        "",

                    phone:
                        "",

                    email:
                        ""

                });


                setOtp(
                    ""
                );


                setOtpRequestId(
                    null
                );


                setSentTo(
                    ""
                );


            } catch (
                err
            ) {

                console.error(err);


                toast.error(
                    err.response
                        ?.data
                        ?.message ||
                    "Unable to verify OTP."
                );


            } finally {

                setVerifying(
                    false
                );

            }

        };


    return (
        <>

            <style>
                {`
                    .donor-update-card {
                        margin-top: 25px;
                        background: white;
                        border: 1px solid #e6ebe8;
                        border-radius: 18px;
                        box-shadow:
                            0 6px 22px
                            rgba(30,55,40,.05);
                        overflow: hidden;
                    }

                    .donor-update-header {
                        padding: 22px 24px;
                        border-bottom:
                            1px solid #edf2ef;
                    }

                    .donor-update-body {
                        padding: 24px;
                    }

                    .donor-update-control {
                        min-height: 47px;
                        border:
                            1px solid #dfe6e2;
                        border-radius: 10px;
                        background: #fbfcfb;
                        box-shadow:
                            none !important;
                    }

                    .donor-update-control:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.08)
                            !important;
                    }

                    .otp-box {
                        margin-top: 20px;
                        padding: 18px;
                        background: #f3f8f5;
                        border:
                            1px solid #dce9e1;
                        border-radius: 12px;
                    }

                    .otp-input {
                        text-align: center;
                        letter-spacing: 8px;
                        font-size: 22px;
                        font-weight: 700;
                    }
                `}
            </style>


            <div className="donor-update-card">

                <div className="donor-update-header">

                    <h4 className="fw-bold mb-1">

                        <FaUserEdit className="me-2 text-success" />

                        Change Donor Details

                    </h4>


                    <small className="text-muted">

                        Leave any new-detail field empty if you do not want to change it.

                    </small>

                </div>


                <div className="donor-update-body">


                    <label className="form-label fw-semibold">

                        <FaEnvelope className="me-2" />

                        Registered Email

                    </label>


                    <input
                        type="email"
                        name="currentEmail"
                        className="form-control donor-update-control mb-4"
                        placeholder="Current registered email"
                        value={
                            form.currentEmail
                        }
                        disabled={
                            Boolean(
                                otpRequestId
                            )
                        }
                        onChange={
                            handleChange
                        }
                    />


                    <div className="row g-3">


                        <div className="col-md-4">

                            <label className="form-label fw-semibold">

                                New Full Name

                            </label>

                            <input
                                name="fullName"
                                className="form-control donor-update-control"
                                placeholder="Leave empty to keep"
                                value={
                                    form.fullName
                                }
                                disabled={
                                    Boolean(
                                        otpRequestId
                                    )
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="col-md-4">

                            <label className="form-label fw-semibold">

                                New Phone Number

                            </label>

                            <input
                                name="phone"
                                className="form-control donor-update-control"
                                placeholder="Leave empty to keep"
                                value={
                                    form.phone
                                }
                                disabled={
                                    Boolean(
                                        otpRequestId
                                    )
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="col-md-4">

                            <label className="form-label fw-semibold">

                                New Email

                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control donor-update-control"
                                placeholder="Leave empty to keep"
                                value={
                                    form.email
                                }
                                disabled={
                                    Boolean(
                                        otpRequestId
                                    )
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>


                    {!otpRequestId && (

                        <button
                            type="button"
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
                                !canRequestOtp
                            }
                            onClick={
                                requestOtp
                            }
                        >

                            {sending ? (

                                <>

                                    <span className="spinner-border spinner-border-sm me-2" />

                                    Sending OTP...

                                </>

                            ) : (

                                <>

                                    <FaShieldAlt className="me-2" />

                                    Verify & Change Details

                                </>

                            )}

                        </button>

                    )}


                    {otpRequestId && (

                        <div className="otp-box">

                            <div className="text-center mb-3">

                                <FaKey className="text-success me-2" />

                                Verification code sent to{" "}

                                <strong>
                                    {sentTo}
                                </strong>

                            </div>


                            <input
                                inputMode="numeric"
                                maxLength="6"
                                className="form-control donor-update-control otp-input"
                                placeholder="000000"
                                value={
                                    otp
                                }
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(
                                                /\D/g,
                                                ""
                                            )
                                    )
                                }
                            />


                            <button
                                type="button"
                                className="btn btn-success w-100 mt-3"
                                disabled={
                                    verifying ||
                                    otp.length !==
                                        6
                                }
                                onClick={
                                    verifyOtp
                                }
                            >

                                {verifying ? (

                                    <>

                                        <span className="spinner-border spinner-border-sm me-2" />

                                        Verifying...

                                    </>

                                ) : (

                                    <>

                                        <FaCheckCircle className="me-2" />

                                        Verify OTP & Save Changes

                                    </>

                                )}

                            </button>


                            <button
                                type="button"
                                className="btn btn-link text-muted w-100 mt-2"
                                disabled={
                                    verifying
                                }
                                onClick={() => {

                                    setOtpRequestId(
                                        null
                                    );

                                    setOtp(
                                        ""
                                    );

                                    setSentTo(
                                        ""
                                    );

                                }}
                            >

                                Edit details / request another code

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </>
    );

}


export default DonorDetailsUpdateForm;