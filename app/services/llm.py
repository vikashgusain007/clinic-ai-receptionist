import json
from typing import List, Dict, Any, Optional

import ollama


MEMORY_EXTRACTION_PROMPT = """
You are a healthcare memory extraction AI.

Your task:
Analyze the user's message and decide what information should be stored.

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

5. HEALTH_QUERY

User is asking about existing health information.

Examples:

- Do I have history of fever?
- What health issues do I have?
- Did I ever have dengue?
- When was my last blood test?

Store:
- Nothing

store_memory = false
store_health_record = false

6. NO_MEMORY

Examples:
- Hello
- How are you?
- Thank you


Rules:
- Do not store temporary conversations.
- Do not create medical facts.
- Only extract information provided by the user.
- If uncertain, reduce confidence.

IMPORTANT:
- Return ONLY valid JSON.
- No markdown.
- No explanations.


User message:

{message}


JSON FORMAT:

{{
    "category": "",
    "confidence": 0.0,

    "store_memory": false,

    "memory_type": "episodic|semantic|preference|null",

    "memory_content": "",

    "store_health_record": false,

    "health_record": {{
        "type": "",
        "title": "",
        "description": "",
        "event_date": ""
    }}
}}
"""


HEALTH_ASSISTANT_PROMPT = """
You are a personal healthcare assistant.

Answer the user's question using ONLY the provided information.

USER QUESTION:
{user_message}


KNOWN HEALTH RECORDS:
{health_records}


RELEVANT MEMORIES:
{memories}


RULES:

1. Never create medical history.
2. Never assume relationships between events.
3. If information is missing, say you don't know.
4. Clearly separate:
   - Previous health information
   - Current guidance
   - Questions for the user


Answer:
"""


async def extract_memory(
    user_id: str,
    message: str
) -> Dict[str, Any]:
    """
    Extract memory and health events from user message.
    """

    prompt = MEMORY_EXTRACTION_PROMPT.format(
        message=message
    )

    response = await call_llm(
        prompt,
        json_mode=True
    )

    return parse_json_response(response)



async def answer_health_query(
    context: Dict[str, Any]
) -> str:
    """
    Generate healthcare assistant response.
    """

    prompt = HEALTH_ASSISTANT_PROMPT.format(
        user_message=context["user_message"],
        health_records=context["health_records"],
        memories=context["memories"]
    )

    response = await call_llm(prompt)

    return response


async def call_llm(
    prompt: str,
    model: str = "llama3.2",
    json_mode: bool = False
) -> str:
    """
    Generic Ollama LLM caller.
    """

    payload = {
        "model": model,
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ]
    }


    if json_mode:
        payload["format"] = "json"


    response = ollama.chat(
        **payload
    )


    return response["message"]["content"]


def parse_json_response(
    response: str
) -> Dict[str, Any]:

    response = response.strip()


    # Remove markdown if model still returns it

    if response.startswith("```json"):
        response = response.replace(
            "```json",
            ""
        )


    if response.endswith("```"):
        response = response[:-3]


    response = response.strip()


    try:

        return json.loads(response)


    except Exception as e:

        print("JSON PARSE FAILED")
        print(response)
        print(e)


        return {
            "category": "NO_MEMORY",
            "confidence": 0,
            "store_memory": False,
            "memory_type": None,
            "memory_content": "",
            "store_health_record": False,
            "health_record": {}
        }


def build_context(
    user_message: str,
    health_records: List[Any],
    memories: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Prepare context for LLM.
    """

    return {
        "user_message": user_message,

        "health_records": [
            format_health_record(record)
            for record in health_records
        ],

        "memories": [
            format_memory(memory)
            for memory in memories
        ]
    }



def format_health_record(
    record: Any
) -> Dict[str, Any]:

    return {
        "type": record.record_type,
        "information": record.value,
        "date": (
            record.memory_metadata.get("event_date")
            if record.memory_metadata
            else None
        )
    }



def format_memory(
    memory: Dict[str, Any]
) -> Dict[str, Any]:

    return {
        "type": memory.get("memory_type"),
        "information": memory.get("text"),
        "score": memory.get("score")
    }