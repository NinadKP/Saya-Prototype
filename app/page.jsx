"use client";

import Image from 'next/image'
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';


export default function Home() {
  const {  data: session} = useSession();
  const [eventInput, setEventInput] = useState("");
  const [result, setResult] = useState("");
  const [calendars, setCalendars] = useState("");

  const handleFetchCalendarData = async () => {
    const response = await fetch('/api/calendar');
    if (response.ok) {
      const data = await response.json();
      const calendarData = data;
      setCalendars(calendarData);

      console.log("Calendars:", calendarData);
    }
  };

  async function onSubmit(event) {
    event.preventDefault();
   
    const response = await fetch("/api/openai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event: eventInput }),
    });
    const data = await response.json();

    console.log("data.result.content", data.result.content);

    let rawResult = data.result.content;

    
    setResult(data.result.content);


  }

  return (
    <section className="w-full flex-center flex-col">
      <h1 className='head_text'>Productivity Assistant Prototype</h1>
      <div className="w-full flex justify-between">
        <div className="w-1/3 p-4 flex justify-center">
          <div>
          <div>
              {session ? (
                <><button onClick={handleFetchCalendarData} className="outline_btn">Fetch</button>
                     {/* Display calendar data as a checklist */}
                  <ul>
                    {Array.isArray(calendars) ? (
                      calendars.map((calendar) => (
                        <li key={calendar.id}>
                          <label>
                            <input type="checkbox" />
                            {calendar.summary}
                          </label>
                        </li>
                      ))
                    ) : (
                      <li>No calendar data available</li>
                    )}
                  </ul>
                </>
              ) : null}
            </div>
            <span>Calendar Events</span>
            <form onSubmit={onSubmit}>
          <input
            className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2"
                              
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
        <div className="w-1/3 p-4 flex justify-center">
          <p>Context</p>
          {result ? (
          <div className="relative w-full ">
            <div
              className="rounded-md border-spacing-2 border-slate-900 bg-slate-100 break-words max-w-500 overflow-x-auto  "
            >
              <pre className="">
                <code
                  className=""
                  dangerouslySetInnerHTML={{ __html: result }}
                />
              </pre>
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2 cursor-pointer copy-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-copy"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
              </svg>
            </div>
          </div>
        ) : null}
        </div>
        <div className="w-1/3 p-4 flex-center">
          Reasoning
        </div>
      </div>

    </section>
  )
}
