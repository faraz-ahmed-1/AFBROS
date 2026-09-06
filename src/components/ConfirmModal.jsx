import {
    FaExclamationTriangle,
    FaTimes
} from "react-icons/fa";

function ConfirmModal({
    show,
    title = "Confirm Action",
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm,
    onCancel
}) {

    if (!show) {
        return null;
    }

    const handleBackdrop = (e) => {

        if (
            e.currentTarget === e.target &&
            !loading
        ) {
            onCancel();
        }
    };

    return (
        <>
            <style>
                {`
                    .afbros-confirm-overlay {
                        position: fixed;
                        inset: 0;
                        z-index: 999990;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                        background: rgba(12, 24, 17, .58);
                        backdrop-filter: blur(4px);
                    }

                    .afbros-confirm-modal {
                        width: 100%;
                        max-width: 430px;
                        background: white;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow:
                            0 30px 90px rgba(0,0,0,.22);
                        animation: confirmEnter .2s ease;
                    }

                    @keyframes confirmEnter {
                        from {
                            opacity: 0;
                            transform:
                                translateY(12px)
                                scale(.97);
                        }

                        to {
                            opacity: 1;
                            transform:
                                translateY(0)
                                scale(1);
                        }
                    }

                    .afbros-confirm-top {
                        display: flex;
                        justify-content: flex-end;
                        padding: 14px 15px 0;
                    }

                    .afbros-confirm-close {
                        width: 34px;
                        height: 34px;
                        border: none;
                        border-radius: 9px;
                        background: #f3f5f4;
                        color: #76827b;
                    }

                    .afbros-confirm-body {
                        padding: 4px 30px 29px;
                        text-align: center;
                    }

                    .afbros-confirm-icon {
                        width: 66px;
                        height: 66px;
                        margin: 0 auto 19px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fff0f1;
                        color: #dc3545;
                        font-size: 25px;
                    }

                    .afbros-confirm-title {
                        margin: 0 0 9px;
                        color: #27372f;
                        font-size: 20px;
                        font-weight: 700;
                    }

                    .afbros-confirm-message {
                        margin: 0;
                        color: #7a867f;
                        font-size: 14px;
                        line-height: 1.65;
                    }

                    .afbros-confirm-footer {
                        display: flex;
                        gap: 10px;
                        padding: 17px 22px;
                        background: #fafbfa;
                        border-top: 1px solid #edf1ee;
                    }

                    .afbros-confirm-footer button {
                        flex: 1;
                        min-height: 45px;
                        border-radius: 10px;
                        font-size: 14px;
                        font-weight: 600;
                    }

                    .afbros-confirm-cancel {
                        background: white;
                        border: 1px solid #dce4df;
                        color: #59675f;
                    }

                    .afbros-confirm-danger {
                        background: #dc3545;
                        border: 1px solid #dc3545;
                        color: white;
                    }

                    .afbros-confirm-danger:hover {
                        background: #c92e3d;
                    }
                `}
            </style>

            <div
                className="afbros-confirm-overlay"
                onMouseDown={handleBackdrop}
            >

                <div
                    className="afbros-confirm-modal"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="afbros-confirm-top">

                        <button
                            type="button"
                            className="afbros-confirm-close"
                            disabled={loading}
                            onClick={onCancel}
                        >
                            <FaTimes />
                        </button>

                    </div>

                    <div className="afbros-confirm-body">

                        <div className="afbros-confirm-icon">
                            <FaExclamationTriangle />
                        </div>

                        <h3 className="afbros-confirm-title">
                            {title}
                        </h3>

                        <p className="afbros-confirm-message">
                            {message}
                        </p>

                    </div>

                    <div className="afbros-confirm-footer">

                        <button
                            type="button"
                            className="afbros-confirm-cancel"
                            disabled={loading}
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>

                        <button
                            type="button"
                            className="afbros-confirm-danger"
                            disabled={loading}
                            onClick={onConfirm}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Processing...
                                </>
                            ) : (
                                confirmText
                            )}

                        </button>

                    </div>

                </div>

            </div>
        </>
    );
}

export default ConfirmModal;