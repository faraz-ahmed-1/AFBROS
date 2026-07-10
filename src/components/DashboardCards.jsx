import { useEffect, useState } from "react";
import api from "../api/api";

function DashboardCards({ dashboard }) {

    return (

        <div className="row g-4 mb-5">

            {/* Total Donations */}

            <div className="col-md-4">

                <div className="card shadow-lg border-0 rounded-4 h-100">

                    <div className="card-body text-center">

                        <h6 className="text-muted mb-3">
                            Total Donations
                        </h6>

                        <h2 className="text-success fw-bold">
                            Rs. {Number(dashboard.totalDonations).toLocaleString()}
                        </h2>

                    </div>

                </div>

            </div>

            {/* Total Expenses */}

            <div className="col-md-4">

                <div className="card shadow-lg border-0 rounded-4 h-100">

                    <div className="card-body text-center">

                        <h6 className="text-muted mb-3">
                            Total Expenses
                        </h6>

                        <h2 className="text-danger fw-bold">
                            Rs. {Number(dashboard.totalExpenses).toLocaleString()}
                        </h2>

                    </div>

                </div>

            </div>

            {/* Remaining Balance */}

            <div className="col-md-4">

                <div className="card shadow-lg border-0 rounded-4 h-100">

                    <div className="card-body text-center">

                        <h6 className="text-muted mb-3">
                            Remaining Balance
                        </h6>

                        <h2 className="text-primary fw-bold">
                            Rs. {Number(dashboard.remainingBalance).toLocaleString()}
                        </h2>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DashboardCards;