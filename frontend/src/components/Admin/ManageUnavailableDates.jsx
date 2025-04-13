import { useEffect, useState } from "react";
import axios from "axios";
import "./ManageUnavailableDates.css";

const ManageUnavailableDates = () => {
  const [dates, setDates] = useState([]);
  const [formData, setFormData] = useState({ date: "", reason: "" });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkConfirming, setIsBulkConfirming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/unavailable-dates/");
      setDates(res.data);
    } catch (err) {
      console.error("Error loading unavailable dates", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId !== null) {
        await axios.put(`http://127.0.0.1:8000/api/admin/unavailable-dates/update/${editId}/`, formData);
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/unavailable-dates/", formData);
      }
      setFormData({ date: "", reason: "" });
      setEditId(null);
      fetchDates();
    } catch (err) {
      console.error("Error saving unavailable date", err);
    }
  };

  const handleCancel = () => {
    setFormData({ date: "", reason: "" });
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({ date: item.date, reason: item.reason });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/unavailable-dates/${id}/`);
      fetchDates();
    } catch (err) {
      console.error("Error deleting unavailable date", err);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`http://127.0.0.1:8000/api/admin/unavailable-dates/${id}/`)
        )
      );
      setSelectedIds([]);
      fetchDates();
    } catch (err) {
      console.error("Error deleting selected dates", err);
    }
  };

  const filteredDates = dates.filter((d) =>
    d.date.includes(searchQuery) || (d.reason && d.reason.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="table-scroll-wrapper">
      <div className="unavailable-container">
        <h2 className="text-4xl font-bold mb-2 text-gray-800 flex items-center gap-3">
          <span>📅</span> Manage Unavailable Dates
        </h2>
        <p className="text-gray-600 mb-6 text-base">
          Add, update, or remove event dates that are unavailable for booking.
        </p>

        <input
          type="text"
          placeholder="🔍 Search by date or reason..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <form onSubmit={handleSubmit} className="unavailable-form form-card">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            placeholder="Optional reason"
            value={formData.reason}
            onChange={handleChange}
          />

          {editId ? (
            <div className="edit-actions">
              <button type="submit" className="confirm-btn">✅ Confirm</button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>❌ Cancel</button>
            </div>
          ) : (
            <button type="submit" className="confirm-btn">➕ Add Date</button>
          )}
        </form>

        <table className="unavailable-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>

        <div className="table-body-scroll">
          <table className="unavailable-table">
            <tbody>
              {filteredDates.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-4">
                    No unavailable dates found.
                  </td>
                </tr>
              ) : (
                filteredDates.map((date, index) => (
                  <tr key={date.id ?? `fallback-${index}`}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(date.id)}
                        onChange={() => handleCheckboxChange(date.id)}
                      />
                    </td>
                    <td>{date.date}</td>
                    <td>{date.reason || "-"}</td>
                    <td>
                      {deleteId === date.id ? (
                        <div className="table-action-buttons">
                          <button onClick={() => handleDelete(date.id)} className="confirm-btn">✅ Confirm</button>
                          <button onClick={() => setDeleteId(null)} className="cancel-btn">❌ Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(date)} className="confirm-btn">✏️ Edit</button>
                          <button onClick={() => setDeleteId(date.id)} className="delete-btn">🗑️ Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {selectedIds.length > 0 && (
            <div className="bulk-delete-wrapper">
              {isBulkConfirming ? (
                <>
                  <button onClick={handleBulkDelete} className="confirm-btn">✅ Confirm</button>
                  <button
                    onClick={() => {
                      setIsBulkConfirming(false);
                      setSelectedIds([]);
                    }}
                    className="cancel-btn"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setIsBulkConfirming(true)} className="bulk-delete-btn">
                  🗑️ Delete Selected ({selectedIds.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUnavailableDates;