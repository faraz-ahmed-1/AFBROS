import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";
import api from "../api/api";

function Depositors() {

  const [search, setSearch] = useState("");
  const [donations, setDonations] = useState([]);
  const [sort, setSort] = useState("id");
  const [currentPage, setCurrentPage] = useState(1);
const recordsPerPage = 10;
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

useEffect(() => {
    fetchDonations();
}, [search, sort]);
const totalAmount = donations.reduce(
    (sum, donor) => sum + Number(donor.amount),
    0
);
  const fetchDonations = async () => {

    try {

        const res = await api.get(
    `/donations?search=${search}&sort=${sort}`
);

        setDonations(res.data);

    } catch (err) {

        console.log(err);

    }

};

const deleteDonation = async (id) => {

    if (!window.confirm("Delete this donation?")) {
        return;
    }

    try {

        await api.delete(`/donations/${id}`);

        fetchDonations();

        if (editingDonation?.id === id) {
            setEditingDonation(null);
        }

        alert("Donation deleted successfully.");

    } catch (err) {

        console.log(err);

        alert("Unable to delete donation.");

    }

};

const [editingDonation, setEditingDonation] = useState(null);

const openEditModal = (donation) => {
    setEditingDonation({
        ...donation,
        fullName: donation.full_name,
        date: donation.donation_date.substring(0,10)
    });
};

const handleEditChange = (e) => {

    setEditingDonation({

        ...editingDonation,

        [e.target.name]: e.target.value

    });

};
const updateDonation = async () => {

    try {

        await api.put(
            `/donations/${editingDonation.id}`,
            editingDonation
        );

        fetchDonations();

        setEditingDonation(null);

    } catch (err) {

        console.log(err);

    }

};

const filteredDonations = donations.filter(d=>{

    if(!fromDate && !toDate)
        return true;

    const date = d.donation_date.substring(0,10);

    if(fromDate && date < fromDate)
        return false;

    if(toDate && date > toDate)
        return false;

    return true;

});

const indexOfLastRecord = currentPage * recordsPerPage;
const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

const currentFilteredDonations = filteredDonations.slice(
    indexOfFirstRecord,
    indexOfLastRecord
);

const totalPages = Math.ceil(
    filteredDonations.length / recordsPerPage
);

const groupedDonors = {};

donations.forEach((donation) => {

    const phone = donation.phone;

    if (!groupedDonors[phone]) {

        groupedDonors[phone] = {
            full_name: donation.full_name,
            phone: donation.phone,
            totalDonation: 0
        };

    }

    groupedDonors[phone].totalDonation += Number(donation.amount);

});

const topDonors = Object.values(groupedDonors)
    .sort((a, b) => b.totalDonation - a.totalDonation)
    .slice(0, 5);
  return (
    <div className="container mt-5">
<div className="row mb-4">

    <div className="col-md-3">

        <div className="card shadow border-0">

            <div className="card-body text-center">

                <h6 className="text-muted">Total Donations</h6>

                <h3 className="text-success">
                    Rs. {Number(totalAmount).toLocaleString()}
                </h3>

            </div>

        </div>

    </div>

    <div className="col-md-3">

        <div className="card shadow border-0">

            <div className="card-body text-center">

                <h6 className="text-muted">Donors</h6>

                <h3 className="text-primary">
                    {donations.length}
                </h3>

            </div>

        </div>

    </div>

    <div className="col-md-3">

        <div className="card shadow border-0">

            <div className="card-body text-center">

                <h6 className="text-muted">Average Donation</h6>

                <h3 className="text-warning">

                    Rs.

                    {
                        donations.length === 0

                        ? 0

                        : Math.round(totalAmount / donations.length).toLocaleString()
                    }

                </h3>

            </div>

        </div>

    </div>

    <div className="col-md-3">

        <div className="card shadow border-0">

            <div className="card-body text-center">

                <h6 className="text-muted">Highest Donation</h6>

                <h3 className="text-danger">

                    Rs.

                    {
                        donations.length === 0

                        ? 0

                        : Math.max(
                            ...donations.map(d => Number(d.amount))
                          ).toLocaleString()
                    }

                </h3>

            </div>

        </div>

    </div>

</div>

<div className="card shadow mb-4">

    <div className="card-header bg-success text-white">

        <h5 className="mb-0">
            Top 5 Donors
        </h5>

    </div>

    <div className="card-body">

<ol className="mb-0">

    {topDonors.map((donor, index) => (

        <li
            key={donor.phone}
            className="d-flex justify-content-between align-items-center mb-2"
        >

            <strong>
                #{index + 1} {donor.full_name}
            </strong>

            <span className="text-success fw-bold">
                Rs. {donor.totalDonation.toLocaleString()}
            </span>

        </li>

    ))}

</ol>

    </div>

</div>

<div className="row mb-4">

    <div className="col-md-4">

        <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e)=>setFromDate(e.target.value)}
        />

    </div>

    <div className="col-md-4">

        <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e)=>setToDate(e.target.value)}
        />

    </div>

</div>

<div className="input-group mb-4">

    <span className="input-group-text">
        🔍
    </span>

    <input
        type="text"
        className="form-control"
        placeholder="Search by Name or Phone..."
        value={search}
onChange={(e) => {

    setSearch(e.target.value);

    setCurrentPage(1);

}}
    />

</div>

<div className="row mb-4">

    <div className="col-md-4">

        <select
            className="form-select"
            value={sort}
onChange={(e) => {

    setSort(e.target.value);

    setCurrentPage(1);

}}
        >

            <option value="id">
                Default
            </option>

            <option value="amountAsc">
                Amount (Low → High)
            </option>

            <option value="amountDesc">
                Amount (High → Low)
            </option>

            <option value="dateNewest">
                Date (Newest)
            </option>

            <option value="dateOldest">
                Date (Oldest)
            </option>

        </select>

    </div>

</div>

      <h2 className="mb-4">Donors</h2>

<div className="table-responsive">

    <table className="table table-hover table-bordered align-middle">

        <thead className="table-success">

            <tr>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Date</th>
                <th className="text-center">Actions</th>
            </tr>

        </thead>

        <tbody>

            {
                 filteredDonations.length === 0 ?

                (
                    <tr>

                        <td
                            colSpan="6"
                            className="text-center py-4"
                        >
                            No donations found.
                        </td>

                    </tr>
                )

                :

                currentFilteredDonations.map((donation) => (

                    <tr key={donation.id}>

                        <td>{donation.full_name}</td>

                        <td>{donation.phone}</td>

                        <td className="fw-bold text-success">
                            Rs. {Number(donation.amount).toLocaleString()}
                        </td>

                        <td>
                            {donation.donation_date?.substring(0,10)}
                        </td>

                        <td className="text-center">

                            <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => openEditModal(donation)}
                            >
                                <FaEdit />
                            </button>

                            <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteDonation(donation.id)}
                            >
                                <FaTrash />
                            </button>

                        </td>

                    </tr>

                ))

            }

        </tbody>

    </table>
    
<div className="d-flex justify-content-between align-items-center mt-4">

    <button
        className="btn btn-outline-success"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
    >
        ← Previous
    </button>

    <span className="fw-bold">

        Page {currentPage} of {totalPages || 1}

    </span>

    <button
        className="btn btn-outline-success"
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage(currentPage + 1)}
    >
        Next →
    </button>

</div>

<div className="text-center mt-3 text-muted">

Showing

<strong> {currentFilteredDonations.length} </strong>

of

<strong> {filteredDonations.length} </strong>

donors

</div>
</div>

{editingDonation && (

<div
    className="modal fade show"
    style={{ display: "block", backgroundColor: "rgba(0,0,0,.5)" }}
>

<div className="modal-dialog">

<div className="modal-content">

<div className="modal-header">

<h5 className="modal-title text-success fw-bold">
Edit Donation
</h5>

<button
className="btn-close"
onClick={() => setEditingDonation(null)}
></button>

</div>

<div className="modal-body">

<label className="form-label">Full Name</label>

<input
    className="form-control mb-3"
    name="fullName"
    value={editingDonation.fullName}
    onChange={handleEditChange}
/>

<label className="form-label">
Phone Number
</label>

<input
className="form-control mb-3"
name="phone"
value={editingDonation.phone}
onChange={handleEditChange}
/>

<label className="form-label">
Donation Amount
</label>

<input
type="number"
className="form-control mb-3"
name="amount"
value={editingDonation.amount}
onChange={handleEditChange}
/>

<label className="form-label">
Donation Date
</label>

<input
type="date"
className="form-control"
name="date"
value={editingDonation.date}
onChange={handleEditChange}
/>

</div>

<div className="modal-footer">

<button
className="btn btn-secondary"
onClick={() => setEditingDonation(null)}
>
Close
</button>

<button
className="btn btn-success px-4"
onClick={updateDonation}
>
Save
</button>

</div>

</div>

</div>

</div>

)}
    </div>
  );
}

export default Depositors;