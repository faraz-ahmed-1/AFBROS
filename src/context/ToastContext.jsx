import {
    createContext,
    useCallback,
    useContext,
    useState
} from "react";

import {
    FaCheckCircle,
    FaExclamationCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimes
} from "react-icons/fa";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {

    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {

        setToasts((current) =>
            current.filter((toast) => toast.id !== id)
        );

    }, []);

    const showToast = useCallback(
        (
            message,
            type = "success",
            duration = 3500
        ) => {

            const id =
                `${Date.now()}-${Math.random()}`;

            setToasts((current) => [
                ...current,
                {
                    id,
                    message,
                    type,
                    duration
                }
            ]);

            window.setTimeout(() => {
                removeToast(id);
            }, duration);

        },
        [removeToast]
    );

    const success = useCallback(
        (message, duration) =>
            showToast(
                message,
                "success",
                duration
            ),
        [showToast]
    );

    const error = useCallback(
        (message, duration) =>
            showToast(
                message,
                "error",
                duration
            ),
        [showToast]
    );

    const warning = useCallback(
        (message, duration) =>
            showToast(
                message,
                "warning",
                duration
            ),
        [showToast]
    );

    const info = useCallback(
        (message, duration) =>
            showToast(
                message,
                "info",
                duration
            ),
        [showToast]
    );

    return (
        <ToastContext.Provider
            value={{
                success,
                error,
                warning,
                info
            }}
        >

            {children}

            <ToastContainer
                toasts={toasts}
                removeToast={removeToast}
            />

        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    removeToast
}) {

    const getIcon = (type) => {

        switch (type) {

            case "success":
                return <FaCheckCircle />;

            case "error":
                return <FaExclamationCircle />;

            case "warning":
                return <FaExclamationTriangle />;

            default:
                return <FaInfoCircle />;
        }
    };

    const getTitle = (type) => {

        switch (type) {

            case "success":
                return "Success";

            case "error":
                return "Error";

            case "warning":
                return "Warning";

            default:
                return "Information";
        }
    };

    return (
        <>
            <style>
                {`
                    .afbros-toast-container {
                        position: fixed;
                        top: 22px;
                        right: 22px;
                        width: calc(100% - 44px);
                        max-width: 390px;
                        z-index: 999999;
                        display: flex;
                        flex-direction: column;
                        gap: 11px;
                        pointer-events: none;
                    }

                    .afbros-toast {
                        position: relative;
                        display: flex;
                        align-items: flex-start;
                        gap: 13px;
                        padding: 15px 16px 17px;
                        background: #ffffff;
                        border: 1px solid #e5ebe7;
                        border-radius: 15px;
                        box-shadow:
                            0 18px 45px rgba(20, 40, 29, 0.14);
                        overflow: hidden;
                        pointer-events: auto;
                        animation: afbrosToastEnter .28s ease;
                    }

                    .afbros-toast::before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        width: 4px;
                    }

                    .afbros-toast.success::before {
                        background: #198754;
                    }

                    .afbros-toast.error::before {
                        background: #dc3545;
                    }

                    .afbros-toast.warning::before {
                        background: #d99a00;
                    }

                    .afbros-toast.info::before {
                        background: #0d6efd;
                    }

                    @keyframes afbrosToastEnter {
                        from {
                            opacity: 0;
                            transform: translateX(25px);
                        }

                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }

                    .afbros-toast-icon {
                        width: 38px;
                        height: 38px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                        font-size: 17px;
                    }

                    .success .afbros-toast-icon {
                        background: #eaf7f0;
                        color: #198754;
                    }

                    .error .afbros-toast-icon {
                        background: #fff0f1;
                        color: #dc3545;
                    }

                    .warning .afbros-toast-icon {
                        background: #fff7df;
                        color: #d99a00;
                    }

                    .info .afbros-toast-icon {
                        background: #edf4ff;
                        color: #0d6efd;
                    }

                    .afbros-toast-content {
                        flex: 1;
                        min-width: 0;
                    }

                    .afbros-toast-title {
                        margin: 0 0 3px;
                        color: #27372f;
                        font-size: 14px;
                        font-weight: 700;
                    }

                    .afbros-toast-message {
                        margin: 0;
                        color: #78837d;
                        font-size: 13px;
                        line-height: 1.5;
                    }

                    .afbros-toast-close {
                        border: none;
                        background: transparent;
                        color: #9ca69f;
                        padding: 4px;
                    }

                    .afbros-toast-progress {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        height: 3px;
                        transform-origin: left;
                        animation-name: afbrosToastProgress;
                        animation-timing-function: linear;
                        animation-fill-mode: forwards;
                    }

                    .success .afbros-toast-progress {
                        background: #198754;
                    }

                    .error .afbros-toast-progress {
                        background: #dc3545;
                    }

                    .warning .afbros-toast-progress {
                        background: #d99a00;
                    }

                    .info .afbros-toast-progress {
                        background: #0d6efd;
                    }

                    @keyframes afbrosToastProgress {
                        from {
                            transform: scaleX(1);
                        }

                        to {
                            transform: scaleX(0);
                        }
                    }

                    @media(max-width:600px) {
                        .afbros-toast-container {
                            top: 14px;
                            left: 14px;
                            right: 14px;
                            width: auto;
                            max-width: none;
                        }
                    }
                `}
            </style>

            <div
                className="afbros-toast-container"
                aria-live="polite"
            >

                {toasts.map((toast) => (

                    <div
                        key={toast.id}
                        className={`afbros-toast ${toast.type}`}
                    >

                        <div className="afbros-toast-icon">
                            {getIcon(toast.type)}
                        </div>

                        <div className="afbros-toast-content">

                            <h4 className="afbros-toast-title">
                                {getTitle(toast.type)}
                            </h4>

                            <p className="afbros-toast-message">
                                {toast.message}
                            </p>

                        </div>

                        <button
                            type="button"
                            className="afbros-toast-close"
                            onClick={() =>
                                removeToast(toast.id)
                            }
                        >
                            <FaTimes />
                        </button>

                        <div
                            className="afbros-toast-progress"
                            style={{
                                animationDuration:
                                    `${toast.duration}ms`
                            }}
                        />

                    </div>

                ))}

            </div>
        </>
    );
}

export function useToast() {

    const context =
        useContext(ToastContext);

    if (!context) {

        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}