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
    messages: [{"role": "user", "content": reviewPrompt(body.eventlist, body.event)}],
  });

  return NextResponse.json({ result: completion.choices[0].message }, { status: 200 });

}

function reviewPrompt(events, eventsadded) {

  return `

  function_name: [parse_json]
  input: ["JSON"]
  rule: [You're a JSON parser. You parse the JSON input and output a schedule with the following format:
  
  1. [Event start date] - [Event Title]
  Context: [Brief summary of event description describing what the event is about like an assistant would do to their boss in as few words as possible]

  Then, 
  ]
  function_name: [analyze_context]
    input: ["text"]
    rule: [I want you to act as a productivity assistant and consultant. I will provide you with a calendar schedule.
      Determine if you there is sufficient context from the title and description to give consultance for the tasks in order to help the user be more productive. 
      You can ask for context if there is not sufficient context, but only ask for three context factors for an event at maximum. 
      List the specific context factors that are necessary for assisting with the task.
      Output the list of events with their context as a text schedule.
  ]
  schedule_input = [Add events from [${eventsadded}] to the schedule parsed from parse_json(${JSON.stringify(events)})]
  analyze_context(parse_json(schedule_input))
  `;

}
