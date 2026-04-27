import { useEffect, useState } from "react";
import axios from "axios";
import { MdEditNote, MdOutlineDeleteOutline } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaRegCalendarAlt } from "react-icons/fa";


const ManageUnavailableDates = () => {
  const [dates, setDates] = useState([]);
  const [formData, setFormData] = useState({ date: "", reason: "" });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkConfirming, setIsBulkConfirming] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPreviewCalendar, setShowPreviewCalendar] = useState(false);
const [previewDates, setPreviewDates] = useState({
  redDates: [],
  greyDates: [],
  greenDates: [],
});


  useEffect(() => {
    fetchDates();
  }, []);
  useEffect(() => {
    const fetchBookingPreviewDates = async () => {
      try {
        const { data } = await axios.get("http://192.168.254.154:8000/api/unavailable-dates/");
        setPreviewDates({
          redDates: data.confirmed_dates.map(date => new Date(date + "T00:00:00")),
          greyDates: data.admin_unavailable_dates.map(date => new Date(date + "T00:00:00")),
          greenDates: data.pending_dates.map(date => new Date(date + "T00:00:00")),
        });
      } catch (err) {
        console.error("Error fetching preview dates:", err);
      }
    };
  
    fetchBookingPreviewDates();
  }, []);
  

  const fetchDates = async () => {
    try {
      const res = await axios.get("http://192.168.254.154:8000/api/admin/unavailable-dates/");
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
        await axios.put(`http://192.168.254.154:8000/api/admin/unavailable-dates/update/${editId}/`, formData);
        } else {
        await axios.post("http://192.168.254.154:8000/api/admin/unavailable-dates/", formData);
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
      await axios.delete(`http://192.168.254.154:8000/api/admin/unavailable-dates/${id}/`);
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
          axios.delete(`http://192.168.254.154:8000/api/admin/unavailable-dates/${id}/`)
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
    <div style={{
      width: '100%',
      maxWidth: 1100,
      margin: '20px auto',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
    }}>
      <h2 style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10, color: '#1f2937' }}>
         Manage Unavailable Dates
      </h2>

      <input
        type="text"
        placeholder=" Search by date or reason..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          width: '60%',
          minWidth: 100,
          maxWidth: 300,
          display: 'block',
          marginBottom: 12,
          padding: '8px 10px',
          border: '1px solid #bbb',
          borderRadius: 6,
          fontSize: 13,
          height: '40px',
        }}
      />

<form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ padding: '8px 10px', borderRadius: 5, border: '1px solid #444', height: '40px', width: '160px' }}
          />
          <FaRegCalendarAlt
            onClick={() => setShowPreviewCalendar(prev => !prev)}
            style={{ fontSize: 20, color: showPreviewCalendar ? "#2563eb" : "#6b7280", cursor: "pointer" }}
            title={showPreviewCalendar ? "Hide preview calendar" : "Show preview calendar"}
          />

          {showPreviewCalendar && (
            <div style={{ position: "absolute", top: "45px", left: 0, zIndex: 999, backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: 8, padding: 10, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: 8 }}>📅 Booking Preview</h4>
              <DatePicker
                inline
                dayClassName={(date) => {
                  const dateString = date.toISOString().split("T")[0];
                  if (previewDates.redDates.some(d => d.toISOString().split("T")[0] === dateString)) return "red-date";
                  if (previewDates.greyDates.some(d => d.toISOString().split("T")[0] === dateString)) return "grey-date";
                  if (previewDates.greenDates.some(d => d.toISOString().split("T")[0] === dateString)) return "green-date";
                  return null;
                }}
              />
              <style>{`
                .red-date { background-color: #f87171 !important; color: white; }
                .grey-date { background-color: #9ca3af !important; color: white; }
                .green-date { background-color: #34d399 !important; color: white; }
              `}</style>
            </div>
          )}
        </div>
        <input
          type="text"
          name="reason"
          placeholder="Optional reason"
          value={formData.reason}
          onChange={handleChange}
          style={{ padding: '8px 10px', borderRadius: 5, border: '1px solid #444', fontSize: 13, height: '40px', width: '240px' }}
        />
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', height: '40px', padding: '0 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14, marginTop: '1px' }}>
          {editId ? 'Confirm' : 'Add Date'}
        </button>
        {editId && (
          <button type="button" onClick={handleCancel} style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', height: '40px', padding: '0 12px', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
            Cancel
          </button>
        )}
      </form>

      {/* The rest of the table and logic continues here... */}
  

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: 16
      }}>
        <thead>
          <tr style={{ backgroundColor: '#1f2937', color: 'white' }}>
            <th style={{
              padding: 8,
              textAlign: 'center',
              border: '1px solid #ccc'
            }}>Select</th>
            <th style={{
              padding: 8,
              textAlign: 'center',
              border: '1px solid #ccc'
            }}>Date</th>
            <th style={{
              padding: 8,
              textAlign: 'center',
              border: '1px solid #ccc'
            }}>Reason</th>
            <th style={{
              padding: 8,
              textAlign: 'center',
              border: '1px solid #ccc'
            }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDates.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: 16 }}>No unavailable dates found.</td>
            </tr>
          ) : (
            filteredDates.map((date) => (
              <tr key={date.id}>
                <td style={{
                  padding: 8,
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(date.id)}
                    onChange={() => handleCheckboxChange(date.id)}
                  />
                </td>
                <td style={{
                  padding: 8,
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}>{date.date}</td>
                <td style={{
                  padding: 8,
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  verticalAlign: 'middle'
                }}>{date.reason || '-'}</td>
                <td style={{
                  padding: 8,
                  border: '1px solid #ccc',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {deleteId === date.id ? (
                    <>
                      <button onClick={() => handleDelete(date.id)} style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: 'none',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}>Confirm</button>
                      <button onClick={() => setDeleteId(null)} style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: 4,
                        border: 'none',
                        fontSize: 12,
                        cursor: 'pointer'
                      }}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center items-center space-x-2 relative -translate-y-1">
  <button
    onClick={() => handleEdit(date)}
    className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded"
  >
    <MdEditNote className="text-xl text-indigo-600 hover:text-indigo-800" />
  </button>
  <button
    onClick={() => setDeleteId(date.id)}
    className="focus:outline-none bg-transparent hover:bg-gray-200 p-1 rounded"
  >
    <MdOutlineDeleteOutline className="text-xl text-red-600 hover:text-red-800" />
  </button>
</div>

                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedIds.length > 0 && (
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          {isBulkConfirming ? (
            <>
              <button onClick={handleBulkDelete} style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                fontWeight: 'bold',
                fontSize: 13,
                borderRadius: 5,
                cursor: 'pointer'
              }}>Confirm</button>
              <button onClick={() => {
                setIsBulkConfirming(false);
                setSelectedIds([]);
              }} style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                fontWeight: 'bold',
                fontSize: 13,
                borderRadius: 5,
                cursor: 'pointer'
              }}>Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsBulkConfirming(true)} style={{
              backgroundColor: '#ff6347',
              color: 'white',
              fontWeight: 'bold',
              padding: '6px 12px',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              fontSize: 13
            }}>
               Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUnavailableDates;
