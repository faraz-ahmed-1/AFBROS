import { useEffect, useState } from "react";
import DashboardCards from "../components/DashboardCards";
import DonationForm from "../components/DonationForm";
import ExpenseForm from "../components/ExpenseForm";
import api from "../api/api";

function Home() {

    const [dashboard, setDashboard] = useState({
        totalDonations: 0,
        totalExpenses: 0,
        remainingBalance: 0
    });

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/dashboard");
            setDashboard(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    return (
        <div className="container py-5">

            <div className="text-center mb-5">
                <h1 className="text-success fw-bold">
                    AFBROS Management System
                </h1>

                <p className="text-muted">
                    Donation & Expense Management
                </p>
            </div>

            <DashboardCards dashboard={dashboard} />

            <div className="row mt-4">

                <div className="col-lg-6 mb-4">
                    <DonationForm refreshDashboard={fetchDashboard} />
                </div>

                <div className="col-lg-6 mb-4">
                    <ExpenseForm refreshDashboard={fetchDashboard} />
                </div>

            </div>

        </div>
    );
}

export default Home;