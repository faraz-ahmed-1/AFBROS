import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import api from "../api/api";

import {
    useToast
} from "../context/ToastContext";

import {
    enterGuestMode,
    leaveGuestMode
} from "../utils/auth";


function Login() {

    const navigate =
        useNavigate();

    const toast =
        useToast();

    const [user, setUser] =
        useState({
            username: "",
            password: ""
        });

    const [
        rememberMe,
        setRememberMe
    ] = useState(false);

    const [
        showPassword,
        setShowPassword
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);


    const handleChange = (e) => {

        setUser((current) => ({
            ...current,
            [e.target.name]:
                e.target.value
        }));

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const res =
                await api.post(
                    "/auth/login",
                    user
                );

            leaveGuestMode();

            if (rememberMe) {

                localStorage.setItem(
                    "token",
                    res.data.token
                );

                sessionStorage.removeItem(
                    "token"
                );

            } else {

                sessionStorage.setItem(
                    "token",
                    res.data.token
                );

                localStorage.removeItem(
                    "token"
                );

            }

            toast.success(
                res.data?.message ||
                "Login successful."
            );

            navigate(
                "/",
                {
                    replace: true
                }
            );

        } catch (err) {

            console.error(err);

            toast.error(
                err.response?.data?.message ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }

    };


    const continueAsGuest = () => {

        enterGuestMode();

        toast.info(
            "Guest mode enabled. Financial data is read-only."
        );

        navigate(
            "/",
            {
                replace: true
            }
        );

    };


    return (
        <>
            <style>
                {`
                    .afbros-login-page {
                        min-height: 100vh;
                        background:
                            radial-gradient(
                                circle at top left,
                                rgba(25,135,84,.10),
                                transparent 35%
                            ),
                            #f4f7f5;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 30px 15px;
                    }

                    .afbros-login-card {
                        width: 100%;
                        max-width: 950px;
                        border-radius: 24px;
                        overflow: hidden;
                        background: white;
                        box-shadow:
                            0 25px 70px rgba(0,0,0,.08),
                            0 5px 20px rgba(0,0,0,.04);
                    }

                    .afbros-brand-panel {
                        min-height: 590px;
                        padding: 55px 45px;
                        color: white;
                        background:
                            linear-gradient(
                                145deg,
                                #0b5d3b,
                                #198754 55%,
                                #2ca66f
                            );
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                    }

                    .afbros-login-logo {
                        width: 58px;
                        height: 58px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 16px;
                        background: rgba(255,255,255,.15);
                        font-weight: 800;
                        font-size: 22px;
                        margin-bottom: 28px;
                    }

                    .afbros-brand-title {
                        font-size: 38px;
                        font-weight: 700;
                    }

                    .afbros-brand-description {
                        max-width: 350px;
                        color: rgba(255,255,255,.8);
                        line-height: 1.8;
                    }

                    .afbros-form-panel {
                        min-height: 590px;
                        padding: 55px;
                        display: flex;
                        justify-content: center;
                        flex-direction: column;
                    }

                    .afbros-login-title {
                        font-size: 30px;
                        color: #1d2a23;
                        font-weight: 700;
                    }

                    .afbros-login-subtitle {
                        color: #7c8781;
                        font-size: 14px;
                        margin-bottom: 32px;
                    }

                    .afbros-login-input {
                        min-height: 52px;
                        border-radius: 12px;
                        background: #fbfcfb;
                        box-shadow: none !important;
                    }

                    .afbros-login-input:focus {
                        border-color: #198754;
                        box-shadow:
                            0 0 0 4px
                            rgba(25,135,84,.1)
                            !important;
                    }

                    .password-wrapper {
                        position: relative;
                    }

                    .password-wrapper input {
                        padding-right: 70px;
                    }

                    .password-toggle {
                        position: absolute;
                        top: 50%;
                        right: 14px;
                        transform: translateY(-50%);
                        border: none;
                        background: transparent;
                        color: #198754;
                        font-size: 13px;
                        font-weight: 600;
                    }

                    .login-primary-btn {
                        min-height: 52px;
                        border-radius: 12px;
                        font-weight: 600;
                    }

                    .guest-divider {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin: 23px 0;
                        color: #9ba49f;
                        font-size: 12px;
                    }

                    .guest-divider::before,
                    .guest-divider::after {
                        content: "";
                        flex: 1;
                        height: 1px;
                        background: #e3e9e5;
                    }

                    .guest-btn {
                        min-height: 50px;
                        border-radius: 12px;
                        border: 1px solid #d9e5de;
                        background: #f8fbf9;
                        color: #198754;
                        font-weight: 600;
                    }

                    .guest-btn:hover {
                        background: #edf7f1;
                        border-color: #198754;
                    }

                    .guest-note {
                        text-align: center;
                        margin-top: 10px;
                        color: #97a29b;
                        font-size: 11px;
                    }

                    @media(max-width:767px) {
                        .afbros-brand-panel {
                            min-height: auto;
                            padding: 30px;
                        }

                        .afbros-form-panel {
                            min-height: auto;
                            padding: 38px 28px;
                        }
                    }
                `}
            </style>

            <div className="afbros-login-page">

                <div className="afbros-login-card">

                    <div className="row g-0">

                        <div className="col-md-6">

                            <div className="afbros-brand-panel">

                                <div>

                                    <div className="afbros-login-logo">
                                        A
                                    </div>

                                    <h1 className="afbros-brand-title">
                                        AFBROS
                                    </h1>

                                    <p className="afbros-brand-description">
                                        Transparent donation and expense
                                        management with secure financial
                                        verification.
                                    </p>

                                </div>

                                <small>
                                    Transparency • Accountability • Trust
                                </small>

                            </div>

                        </div>

                        <div className="col-md-6">

                            <div className="afbros-form-panel">

                                <h2 className="afbros-login-title">
                                    Finance Manager
                                </h2>

                                <p className="afbros-login-subtitle">
                                    Sign in for full financial management access.
                                </p>

                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Username
                                        </label>

                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control afbros-login-input"
                                            placeholder="Enter username"
                                            value={user.username}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="mb-3">

                                        <label className="form-label fw-semibold">
                                            Password
                                        </label>

                                        <div className="password-wrapper">

                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                className="form-control afbros-login-input"
                                                placeholder="Enter password"
                                                value={user.password}
                                                onChange={handleChange}
                                                required
                                            />

                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (value) =>
                                                            !value
                                                    )
                                                }
                                            >
                                                {showPassword
                                                    ? "Hide"
                                                    : "Show"}
                                            </button>

                                        </div>

                                    </div>

                                    <div className="form-check mb-4">

                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) =>
                                                setRememberMe(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                        <label
                                            htmlFor="rememberMe"
                                            className="form-check-label"
                                        >
                                            Remember me
                                        </label>

                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success login-primary-btn w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Signing In...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                </form>

                                <div className="guest-divider">
                                    OR
                                </div>

                                <button
                                    type="button"
                                    className="guest-btn w-100"
                                    onClick={continueAsGuest}
                                >
                                    Continue as Guest
                                </button>

                                <div className="guest-note">
                                    Guest access is read-only, but you can submit a donation for verification.
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Login;