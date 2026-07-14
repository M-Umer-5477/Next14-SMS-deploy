// components/GenerateTimetableButton.js
'use client'
import { useState } from "react";
import { HiOutlineCalendar } from 'react-icons/hi';

const GenerateTimetableButton = () => {
    const [loading, setLoading] = useState(false);
  
    const handleClick = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/generate-session-timetable', {
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
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner spinner-sm" />
            Generating...
          </>
        ) : (
          <>
            <HiOutlineCalendar className="w-4 h-4" />
            Generate Timetable
          </>
        )}
      </button>
    );
  };
  
  export default GenerateTimetableButton;