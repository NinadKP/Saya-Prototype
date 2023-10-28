"use client";

import { google } from 'googleapis';
import { getSession } from 'next-auth/client';

const getGoogleCalendarEvents = async () => {
  // Get the session from NextAuth
  const session = await getSession();

  // Create a new OAuth2 client
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: session.accessToken,
  });

  // Create a new Calendar API client
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Make a request to the Calendar API to get the events
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  // Return the events
  return response.data.items;
};

// // Example usage in an API route
// export default async function handler(req, res) {
//   const events = await getGoogleCalendarEvents();
//   res.status(200).json(events);
// }

import { NextResponse } from "next/server";

export async function GET(request) { 
  const events = await getGoogleCalendarEvents();
  return NextResponse.json({ events}, { status: 200 }); 
};