import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Preparation({ selectedDate }) {
    const { date } = useParams(); // Get date from URL
    const [preparations, setPreparations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`Fetching preparations for date: ${date || selectedDate}`);
                const response = await axios.get(`http://127.0.0.1:8000/api/preparations/?date=${date || selectedDate}`);
                console.log("Fetched Preparation Data:", response.data);
                setPreparations(response.data);
            } catch (error) {
                console.error('Error fetching preparations:', error);
            }
        };

        if (date || selectedDate) {
            fetchData();
        }
    }, [date, selectedDate]);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Preparation Inventory for {date || selectedDate}</h1>

            <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Product</th>
                        <th className="border border-gray-300 px-4 py-2">Quantity</th>
                        <th className="border border-gray-300 px-4 py-2">Preparation Date</th>
                    </tr>
                </thead>
                <tbody>
                    {preparations.length === 0 ? (
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 text-center" colSpan="3">
                                No items found for this date.
                            </td>
                        </tr>
                    ) : (
                        preparations.map((prep, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{prep.item_name}</td>
                                <td className="border border-gray-300 px-4 py-2">{prep.quantity}</td>
                                <td className="border border-gray-300 px-4 py-2">{prep.preparation_date}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Preparation;
