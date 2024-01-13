"use client";

import Image from 'next/image'
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';


export default function Home() {
  const {  data: session} = useSession();
  const [eventInput, setEventInput] = useState("");
  const [result, setResult] = useState("");
  const [calendars, setCalendars] = useState("");
  const [events, setEvents] = useState("");
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [reasoning, setReasoning] = useState("");
  const [report, setReport] = useState("");


  const handleFetchCalendarData = async () => {
    const response = await fetch('/api/calendar');
    if (response.ok) {
      const data = await response.json();
      const calendarData = data;
      setCalendars(calendarData);

      console.log("Calendars:", calendarData);
    }
  };
  
  const handleCheckboxChange = (calendarId) => {
    const isSelected = selectedCalendars.includes(calendarId);
    if (isSelected) {
      setSelectedCalendars(selectedCalendars.filter((id) => id !== calendarId));
    } else {
      setSelectedCalendars([...selectedCalendars, calendarId]);
    }
  };

  const fetchEvents = async () => {
    console.log('Selected Calendars:', selectedCalendars);
    const queryParams = new URLSearchParams({
      calendars: selectedCalendars.join(','), 
    });
  
    const response = await fetch(`/api/events?${queryParams}`);
    if (response.ok) {
      const data = await response.json();
      const eventData = data;
      setEvents(eventData);
    }
  };

  const generateReasoning = async () => {
    const response = await fetch("/api/reason", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventlist: events, event: eventInput, context: result}),
    });
    const data = await response.json();

    console.log("data.result.content", data.result.content);

    let rawReason = data.result.content;

    
    setReasoning(data.result.content);

  };

  const generateReport = async () => {
    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventlist: events, event: eventInput, context: result, reason: reasoning}),
    });
    const data = await response.json();

    console.log("data.result.content", data.result.content);

    let rawReport = data.result.content;

    
    setReport(data.result.content);

  };

  async function onSubmit(event) {
    event.preventDefault();
  
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventlist: events, event: eventInput }),
    });
    const data = await response.json();

    console.log("data.result.content", data.result.content);

    let rawResult = data.result.content;

    
    setResult(data.result.content);


  }

  return (
    <section className="w-full ">
      <div className='w-full flex-center flex-col'>
      <h1 className=' head_text text-3xl'>Productivity Assistant Prototype</h1>
      <div className="w-full flex justify-between">
        <div className="w-1/3 p-2 flex justify-center">
          <div>
          <h1 class="text-2xl font-bold mb-4">Calendar Events</h1>
          <div >
              {session ? (
                <><button onClick={handleFetchCalendarData} className="outline_btn">Fetch Calendars</button>
                     {/* Display calendar data as a checklist */}
                  <ul>
                    {Array.isArray(calendars) ? (
                      calendars.map((calendar) => (
                        <li key={calendar.id}>
                          <label>
                          <input
                  type="checkbox"
                  checked={selectedCalendars.includes(calendar.id)}
                  onChange={() => handleCheckboxChange(calendar.id)}
                />
                            {calendar.summary}
                          </label>
                        </li>
                      ))
                    ) : (
                      <li>No calendar data available</li>
                    )}
                  </ul>
                  <button onClick={fetchEvents} className="outline_btn">Fetch Events</button>
                </>
              ) : null}
            </div>
            <ol type="1" style={{ listStyleType: 'decimal' }}>
              {Array.isArray(events) ? (
                events.map((event) => (
                  <li key={event.id}>
                    <label>
                    {new Date(event.start.dateTime).toLocaleString()} - {event.summary}
                    </label>
                  </li>
                ))
              ) : (
                <li>No event data available</li>
              )}
            </ol>
            <form onSubmit={onSubmit}>
            <input
            className="form_input"
                              
            type="text"
            name="events"
            placeholder="Edit events here.."
            value={eventInput}
            role="textbox" 
            contentEditable="true"
            onChange={(e) => setEventInput(e.target.value) }
          />

          <button
            className="black_btn"
            type="submit"
          >
            Generate context
          </button>
        </form>
          </div>
        </div>
        <div className="w-1/3 p-2 flex justify-center">
        <div>
        <h1 class="text-2xl font-bold mb-4">Context</h1>
          
          {result ? (        
              <textarea
      className="form_textarea"
      value={result}
      onChange={(e) => setResult(e.target.value)}
    />
        ) : null}
        <button onClick={generateReasoning} className="black_btn">Generate Reasoning</button>
        </div>
        </div>
        <div className="w-1/3 p-2 flex justify-center">
        <div>
        <h1 class="text-2xl font-bold mb-4">Reasoning</h1>
          
          {result ? (        
              <textarea
      className="form_textarea"
      value={reasoning}
      onChange={(e) => setReasoning(e.target.value)}
    />
        ) : null}
        <button onClick={generateReport} className="black_btn">Generate Report</button>
        </div>
        </div>
      </div>
      <div className="w-full flex flex-col items-center">
      <h1 className='head_text mb-4'>{report ? ("Report") : null}</h1>
  <div className="w-full">
    {report ? (
       // <div  dangerouslySetInnerHTML={{ __html: report }} />
      <textarea
        className=" w-full flex rounded-lg h-full min-h-24 mt-2 p-3 text-sm text-gray-500 outline-0"
        value={report}
        onChange={(e) => setReport(e.target.value)}
      />
      ) : null}
  </div>
</div>
</div>
    </section>
    
  )
}
