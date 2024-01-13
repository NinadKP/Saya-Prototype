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
    messages: [{"role": "user", "content": reviewPrompt(body.eventlist, body.event,body.context)}],
  });

  return NextResponse.json({ result: completion.choices[0].message }, { status: 200 });

}

function reviewPrompt(events, eventsadded,context) {

  return `

  function_name: [generate_reasoning]
  input: ["text"]
  rule: [You're a productivity assistant. Look at the input schedule and the context input given and list out steps you would take to 
  assist the user with the tasks and events in the input. 
  Output a proper list of steps you would take to process the events given the context in the input.
  Output should be text.
  schedule_input = [Add events from [${eventsadded}] to the schedule parsed from parse_json(${JSON.stringify(events)})]
  context_input = ${context}
  generate_reasoning(schedule_input+context_input)
  
  `;

}
