import {NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});


export async function POST(request) {

    const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{"role": "user", "content": reviewPrompt('request.body.event')}],
  });
  return NextResponse.json({ result: completion.choices[0].message }, { status: 200 });

}

function reviewPrompt(events) {
  return `
  You're a productivity assistant program. Take the schedule of events as below as input and follow the steps below its. Be brief and straightforward.
  Schedule:
   ${events}
  
    Steps:
  1) Determine the sufficient context factors needed for you to process these and consult on them
  2) Is the sufficient context available for each considering the factors your determined? if not, ask for it to the user? There should be no more than 3 context factors for each event

  `;
}
