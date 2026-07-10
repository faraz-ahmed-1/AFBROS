import { useState } from "react";
import api from "../api/api";

function DonationForm({ refreshDashboard }) {

  const [donation, setDonation] = useState({
    fullName: "",
    phone: "",
    amount: "",
    date: ""
  });

  const handleChange = (e) => {
    setDonation({
      ...donation,
      [e.target.name]: e.target.value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/donations", donation);
    await refreshDashboard();

    alert(response.data.message);

    setDonation({
      fullName: "",
      phone: "",
      amount: "",
      date: ""
    });

  } catch (error) {
    console.error(error);

    alert("Failed to save donation.");
  }
};

  return (
    <div className="card shadow border-0 h-100">

      <div className="card-header bg-success text-white">
        <h4 className="mb-0">Add Donation</h4>
      </div>

      <div className="card-body">

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label className="form-label">Full Name</label>

            <input
              type="text"
              name="fullName"
              className="form-control"
              value={donation.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>

            <input
              type="text"
              name="phone"
              className="form-control"
              value={donation.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Donation Amount</label>

            <input
              type="number"
              name="amount"
              className="form-control"
              value={donation.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Date</label>

            <input
              type="date"
              name="date"
              className="form-control"
              value={donation.date}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-success w-100">
            Save Donation
          </button>

        </form>

      </div>

    </div>
  );
}

export default DonationForm;