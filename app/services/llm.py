import json
import ollama

async def extract_memory(
    user_id,
    message
):

    prompt = f"""
You are a healthcare memory extraction AI.

Your job is to analyze the user's message and decide what information should be stored.

Classify the information into one or more categories.

Categories:

1. CURRENT_HEALTH_EVENT
Examples:
- I have fever for 3 days
- I have headache today
- I am feeling dizzy

Store:
- HealthRecord
- Episodic memory


2. PAST_MEDICAL_HISTORY
Examples:
- I had an accident last year
- I had surgery in 2020
- I was diagnosed with diabetes

Store:
- HealthRecord
- Episodic memory


3. SEMANTIC_MEMORY
Long-term facts or patterns.

Examples:
- I always get fever during weather changes
- I am allergic to peanuts

Store:
- Memory only


4. USER_PREFERENCE

Examples:
- I prefer natural medicine
- I don't like injections

Store:
- Memory only


5. NO_MEMORY

Examples:
- Hello
- How are you?
- Thank you


Rules:

- Do not store temporary conversations.
- Do not create medical facts that the user did not provide.
- If uncertain, set confidence lower.
IMPORTANT:
- Output ONLY valid JSON.
- Do not add explanations.
- Do not use markdown.
- Do not wrap JSON in ``` blocks.



User message:

{message}


Return format:

{{
    "category":"",
    "confidence":0.0,

    "store_memory":true,

    "memory_type":
        "episodic|semantic|preference|null",

    "memory_content":"",

    "store_health_record":true,

    "health_record": {{
        "type":"",
        "title":"",
        "description":"",
        "event_date":""
    }}
}}
"""

    result = await generate_response(
        {
            "user_message": prompt,
            "memories": [],
            "health_records": []
        }
    )

    return json.loads(result)

async def generate_response(context):


    prompt = f"""

    You are a personal healthcare assistant.

    Your job is to answer based on the user's stored information.


    USER QUESTION:

    {context["user_message"]}



    KNOWN HEALTH RECORDS:

    {context["health_records"]}



    RELEVANT MEMORIES:

    {context["memories"]}



    RULES:

    1. Only use information provided above.
    2. Never create medical history.
    3. Never assume two events are related.
    4. If information is missing, say you don't know.
    5. Clearly separate:
    - Previous health information
    - Current guidance
    - Questions for user


    Answer the user.


    """



    response = ollama.chat(
        model="llama3.2",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )


    return response["message"]["content"]


from typing import List, Dict


def build_context(
    user_message: str,
    health_records: List[Dict],
    memories: List[Dict]
):

    context = {

        "user_message": user_message,


        "health_records": [],


        "memories": [],

    }


    # Format health records

    for record in health_records:

        context["health_records"].append(
            {
                "type": record.record_type,
                "information": record.value,
                "date": (
                    record.memory_metadata.get("event_date")
                    if record.memory_metadata
                    else None
                )
            }
        )


    # Format memories

    for memory in memories:

        context["memories"].append(
            {
                "type": memory.get("memory_type"),
                "information": memory.get("text"),
                "score": memory.get("score")
            }
        )


    return context

