import json
import g4f
from typing import List, Dict, Union
from app.schemas.test import (
    TestCreateRequest,
    TestCreateResponse,
    TestPassRequest,
    TestPassResponse
)
from app.models.theme import Theme
from peewee import DoesNotExist
from pprint import pprint

MODEL = "gpt-4o-mini"

async def create_test(request: TestCreateRequest) -> TestCreateResponse:
    """
    Генерирует один вопрос с четырьмя вариантами ответа по заданной теме.
    Сохраняет контекст темы из БД и обращается к модели через g4f.
    """
    # 1. Получаем тему из БД
    try:
        theme = Theme.get_by_id(request.theme)
    except DoesNotExist:
        raise ValueError(f"Theme with id={request.theme} not found")

    user_prompt = (
        "You are a helpful assistant that generates multiple-choice questions.\n"
        f"Theme: {theme.name}\n"
        f"Description: {theme.descr}"
        "Please generate exactly one question and four answer options, "
        "marking the correct one (or many correct ones). "
        "Output strictly in JSON format, e.g.:\n"
        "{\n"
        "  \"question\": \"...\",\n"
        "  \"answers\": [\n"
        "    {\"text\": \"...\", \"is_correct\": true},\n"
        "    {\"text\": \"...\", \"is_correct\": false},\n"
        "    {\"text\": \"...\", \"is_correct\": false},\n"
        "    {\"text\": \"...\", \"is_correct\": false}\n"
        "  ]\n"
        "}"
    )

    pprint("Prompts:")
    pprint(user_prompt)

    # 3. Вызываем модель
    raw = g4f.ChatCompletion.create(
        model=MODEL,
        messages=[
            {"role": "user", "content": user_prompt}
        ],
        stream=False
    ).strip()

    pprint("Answer:")
    pprint(raw)

    # 4. Парсим JSON
    try:
        data = json.loads(raw)
        question = data["question"]
        answers_raw = data["answers"]
    except Exception as e:
        raise ValueError(
            f"Failed to parse JSON from model: {e}\nRaw response: {raw}")

    # 5. Преобразуем в нужный формат List[Dict]
    answers: List[Dict[str, str]] = []
    for ans in answers_raw:
        text = ans.get("text")
        correct = ans.get("is_correct", False)
        answers.append({text: "t" if correct else "f"})

    return TestCreateResponse(
        theme=request.theme,
        question=question,
        answers=answers
    )


async def pass_test(request: TestPassRequest) -> TestPassResponse:
    """
    Определяет верный ответ (букву A, B, C или D) для переданного вопроса и вариантов.
    """

    try:
        theme = Theme.get_by_id(request.theme)
    except DoesNotExist:
        raise ValueError(f"Theme with id={request.theme} not found")

    # 1. Собираем список опций в текстовом виде
    options: List[str] = []
    for item in request.answers:
        if isinstance(item, dict):
            # если передают dict, берём первый ключ
            options.append(next(iter(item)))
        else:
            # иначе предполагаем, что это строка
            options.append(str(item))
    if len(options) != 4:
        raise ValueError("Expected exactly 4 answer options")

    opts_text = "\n".join(
        f"{letter}) {text}"
        for letter, text in zip(["A", "B", "C", "D"], options)
    )

    prompt = (
        "You are an expert at choosing the correct answer."
        f"You are working on theme {theme.name}"
        f"Theme is {theme.descr}"
        f"Question: {request.question}\n"
        f"Options:\n{opts_text}"
        "Return only letters (A, B, C or D). There can be multiple answers."
        "Return all letters (A, B, C, D) corresponding to correct answers, "
        "as a JSON array, e.g. [\"A\",\"C\"]."
    )

    pprint("Prompt:")
    pprint(prompt)

    # 3. Запрос к модели
    raw = g4f.ChatCompletion.create(
        model=MODEL,
        messages=[
            # {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        stream=False
    ).strip()

    pprint("Answer:")
    pprint(raw)

    # 5. Парсим JSON-массив букв
    try:
        import json
        letters = json.loads(raw)
        if not isinstance(letters, list):
            raise ValueError("Response is not a JSON list")
        # Оставляем только допустимые буквы и приводим к верхнему регистру
        valid = {"A", "B", "C", "D"}
        right = [ltr.upper() for ltr in letters if ltr.upper() in valid]
    except Exception as e:
        raise ValueError(
            f"Failed to parse list of answers: {e}\nRaw response: {raw}")

    if not right:
        raise ValueError(f"No valid answer letters found in response: {raw}")

    return TestPassResponse(right_answers=right)

    # # 4. Парсим первую букву (A–D)
    # letter = None
    # for char in raw:
    #     if char.upper() in ("A", "B", "C", "D"):
    #         letter = char.upper()
    #         break
    # if letter is None:
    #     raise ValueError(f"Could not find answer letter in response: {raw}")
    #
    # return TestPassResponse(right_answer=letter)
