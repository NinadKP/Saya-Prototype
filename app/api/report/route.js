import {NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});


export async function POST(request) {
  const body = await request.json()
  console.log(reviewPrompt(body.eventlist, body.event));

    const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    // "response_format": {"type": "json_object"},
    messages: [{"role": "user", "content": reviewPrompt(body.eventlist, body.event,body.context, body.reason)}],
  });

  return NextResponse.json({ result: completion.choices[0].message }, { status: 200 });

}

function reviewPrompt(events, eventsadded,context, reason) {

  return `

  function_name: [generate_report]
  input: ["text"]
  rule: [You're a productivity assistant. Look at the input schedule, the context input given and go through the reasoning steps in the 
  reasoning input to process the data. You want to help the user break down tasks into smaller tasks and generate an time estimate for 
  each task. 
  Output a report with the above instructions and suggestions to help the user be more productive as if you're an expert productivity consultant.
  Output should be text.
  schedule_input = [Add events from [${eventsadded}] to the schedule parsed from parse_json(${JSON.stringify(events)})]
  context_input = ${context}
  reasoning_input = ${reason}
  generate_report(schedule_input,context_input,reasoning_input)
  
  `;

}
