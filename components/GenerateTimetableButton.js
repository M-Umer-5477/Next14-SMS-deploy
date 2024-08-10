// components/GenerateTimetableButton.js
'use client'
import { useState } from "react";
const GenerateTimetableButton = () => {
    const [loading, setLoading] = useState(false);
  
    const handleClick = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/generate-session-timetable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionStartDate: '2024-01-01', sessionEndDate: '2024-12-31' })
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error generating timetable:', error);
        alert('Error generating timetable.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <button
        onClick={handleClick}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Timetable'}
      </button>
    );
  };
  
  export default GenerateTimetableButton;
  