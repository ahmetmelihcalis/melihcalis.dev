import hashlib
import json
import os
import re
import threading
import time
from pathlib import Path
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, Request
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

load_dotenv()

ALLOWED_ORIGINS = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:3000",
    "https://melihcalis.dev",
    "https://www.melihcalis.dev",
]

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"
BREVO_SUCCESS_STATUS = 201
BREVO_TIMEOUT_SECONDS = 10
CONTACT_SERVICE_UNAVAILABLE = "Contact service is not configured."
EMAIL_DELIVERY_FAILED = "Email service could not process the message."
EMAIL_SERVICE_UNAVAILABLE = "Email service is unavailable."
EMAIL_SERVICE_TIMEOUT = "Email service timed out."
INTERNAL_SERVER_ERROR = "Internal Server Error"

GITHUB_USER = os.getenv("GITHUB_USER", "ahmetmelihcalis")
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"
PINNED_QUERY = """
query($login: String!, $count: Int!) {
  user(login: $login) {
    pinnedItems(first: $count, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          stargazerCount
          forkCount
          owner { login }
          primaryLanguage { name color }
        }
      }
    }
  }
}
"""
PINNED_LIMIT = 5
PINNED_CACHE_SECONDS = 60 * 60
PINNED_TIMEOUT_SECONDS = 8
PINNED_UNAVAILABLE = "Pinned repositories are unavailable."
SAFE_NAME = re.compile(r"^[A-Za-z0-9_.-]{1,100}$")
SAFE_COLOR = re.compile(r"^#[0-9a-fA-F]{3,8}$")

TRANSLATE_URL = "https://api.mymemory.translated.net/get"
TRANSLATE_TIMEOUT_SECONDS = 8
TRANSLATE_MAX_CHARS = 450
TRANSLATION_CACHE_FILE = Path(__file__).with_name("translation_cache.json")
TURKISH_CHARS = set("çğıöşüÇĞİÖŞÜ")
TURKISH_WORDS = {"ve", "bir", "ile", "için", "bu", "olan", "tarafından", "projesi", "reposudur", "uygulama"}

_pinned_cache: dict = {"time": 0.0, "repos": None}
_pinned_lock = threading.Lock()
_translation_cache: dict[str, str] = {}

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend service is running."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContactForm(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=5000)
    website: Optional[str] = None


def get_email_settings() -> tuple[str, str]:
    brevo_api_key = os.getenv("BREVO_API_KEY")
    my_email = os.getenv("MY_EMAIL")

    if not brevo_api_key or not my_email:
        raise HTTPException(status_code=500, detail=CONTACT_SERVICE_UNAVAILABLE)

    return brevo_api_key, my_email


def build_email_content(data: ContactForm) -> str:
    return f"""
    You have a new message from your website!
    
    Sender: {data.name}
    Email: {data.email}
    
    Message:
    {data.message}
    """


def build_brevo_headers(api_key: str) -> dict[str, str]:
    return {
        "accept": "application/json",
        "api-key": api_key,
        "content-type": "application/json",
    }


def build_brevo_payload(data: ContactForm, my_email: str) -> dict:
    return {
        "sender": {"name": data.name, "email": my_email},
        "to": [{"email": my_email, "name": "Ahmet Melih"}],
        "replyTo": {"email": data.email, "name": data.name},
        "subject": f"PORTFOLIO MESSAGE: {data.name}",
        "textContent": build_email_content(data),
    }

@app.post("/api/contact")
@limiter.limit("5/minute")
def send_mail(request: Request, data: ContactForm):
    if data.website and data.website.strip() != "":
        raise HTTPException(status_code=400, detail="Spam detected.")

    brevo_api_key, my_email = get_email_settings()
    headers = build_brevo_headers(brevo_api_key)
    payload = build_brevo_payload(data, my_email)

    try:
        response = requests.post(
            BREVO_API_URL,
            json=payload,
            headers=headers,
            timeout=BREVO_TIMEOUT_SECONDS,
        )
        
        if response.status_code == BREVO_SUCCESS_STATUS:
            return {"message": "Message sent successfully!"}

        print(f"Brevo Error: {response.text}")
        raise HTTPException(status_code=502, detail=EMAIL_DELIVERY_FAILED)
    except requests.Timeout:
        print("Brevo Error: Request timed out")
        raise HTTPException(status_code=504, detail=EMAIL_SERVICE_TIMEOUT)
    except requests.RequestException as e:
        print(f"Brevo Request Error: {e}")
        raise HTTPException(status_code=502, detail=EMAIL_SERVICE_UNAVAILABLE)
    except HTTPException:
        raise
    except Exception as e:
        print(f"System Error: {e}")
        raise HTTPException(status_code=500, detail=INTERNAL_SERVER_ERROR)


def clean_pinned_repo(raw) -> Optional[dict]:
    if not isinstance(raw, dict):
        return None

    name = raw.get("name")
    author = raw.get("author")
    if not (isinstance(name, str) and SAFE_NAME.match(name)):
        return None
    if not (isinstance(author, str) and SAFE_NAME.match(author)):
        return None

    description = raw.get("description")
    language = raw.get("language")
    color = raw.get("languageColor")

    def count(value) -> int:
        return value if isinstance(value, int) and not isinstance(value, bool) and value >= 0 else 0

    return {
        "author": author,
        "name": name,
        "description": description[:300] if isinstance(description, str) else "",
        "language": language[:40] if isinstance(language, str) else "",
        "languageColor": color if isinstance(color, str) and SAFE_COLOR.match(color) else None,
        "stars": count(raw.get("stars")),
        "forks": count(raw.get("forks")),
    }


def fetch_pinned_repos() -> list[dict]:
    github_token = os.getenv("GITHUB_TOKEN")
    if not github_token:
        raise ValueError("GITHUB_TOKEN is not configured")

    response = requests.post(
        GITHUB_GRAPHQL_URL,
        json={"query": PINNED_QUERY, "variables": {"login": GITHUB_USER, "count": PINNED_LIMIT}},
        headers={
            "Authorization": f"Bearer {github_token}",
            "User-Agent": "melihcalis.dev",
        },
        timeout=PINNED_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    payload = response.json()
    nodes = (((payload.get("data") or {}).get("user") or {}).get("pinnedItems") or {}).get("nodes")
    errors = payload.get("errors") or []
    if not isinstance(nodes, list):
        message = errors[0].get("message") if errors else "unexpected payload"
        raise ValueError(f"GitHub GraphQL error: {message}")
    if errors:
        # Partial result, e.g. an organization blocks this token for one pinned repo.
        print(f"Pinned Repos Warning: {len(errors)} item(s) skipped: {errors[0].get('message')}")

    repos = []
    for node in nodes:
        if not isinstance(node, dict):
            continue
        language = node.get("primaryLanguage") or {}
        repo = clean_pinned_repo({
            "author": (node.get("owner") or {}).get("login"),
            "name": node.get("name"),
            "description": node.get("description"),
            "language": language.get("name"),
            "languageColor": language.get("color"),
            "stars": node.get("stargazerCount"),
            "forks": node.get("forkCount"),
        })
        if repo:
            repos.append(repo)
    return repos[:PINNED_LIMIT]


def load_translation_cache() -> None:
    try:
        data = json.loads(TRANSLATION_CACHE_FILE.read_text(encoding="utf-8"))
        _translation_cache.update({k: v for k, v in data.items() if isinstance(v, str)})
    except (OSError, ValueError, AttributeError):
        pass


def save_translation_cache() -> None:
    try:
        TRANSLATION_CACHE_FILE.write_text(json.dumps(_translation_cache, ensure_ascii=False), encoding="utf-8")
    except OSError as e:
        print(f"Translation cache could not be saved: {e}")


def detect_language(text: str) -> str:
    if any(char in TURKISH_CHARS for char in text):
        return "tr"
    words = set(re.findall(r"[A-Za-zçğıöşüÇĞİÖŞÜ]+", text.lower()))
    return "tr" if words & TURKISH_WORDS else "en"


def translate_text(text: str, source: str, target: str) -> str:
    key = f"{source}>{target}:{hashlib.sha1(text.encode('utf-8')).hexdigest()}"
    if key in _translation_cache:
        return _translation_cache[key]

    response = requests.get(
        TRANSLATE_URL,
        params={"q": text[:TRANSLATE_MAX_CHARS], "langpair": f"{source}|{target}"},
        timeout=TRANSLATE_TIMEOUT_SECONDS,
    )
    response.raise_for_status()
    payload = response.json()
    translated = (payload.get("responseData") or {}).get("translatedText")
    if (
        str(payload.get("responseStatus")) != "200"
        or not isinstance(translated, str)
        or not translated.strip()
        or "MYMEMORY WARNING" in translated.upper()
    ):
        raise ValueError(f"Translation failed: {str(payload.get('responseDetails'))[:120]}")

    translated = translated.strip()[:600]
    _translation_cache[key] = translated
    save_translation_cache()
    return translated


def add_translations(repos: list[dict]) -> None:
    for repo in repos:
        description = repo["description"]
        if not description:
            repo["translations"] = {}
            continue

        source = detect_language(description)
        target = "en" if source == "tr" else "tr"
        repo["translations"] = {source: description}
        try:
            repo["translations"][target] = translate_text(description, source, target)
        except ValueError as e:
            print(f"Pinned Repos Translation Warning: {e}")
        except requests.RequestException as e:
            print(f"Pinned Repos Translation Error: {e}")
            break

    for repo in repos:
        repo.setdefault("translations", {})


load_translation_cache()


@app.get("/api/pinned")
@limiter.limit("30/minute")
def get_pinned(request: Request):
    with _pinned_lock:
        cached = _pinned_cache["repos"]
        if cached is not None and time.time() - _pinned_cache["time"] < PINNED_CACHE_SECONDS:
            return {"repos": cached}

        try:
            repos = fetch_pinned_repos()
            if repos:
                add_translations(repos)
                _pinned_cache["repos"] = repos
                _pinned_cache["time"] = time.time()
                return {"repos": repos}
        except (requests.RequestException, ValueError) as e:
            print(f"Pinned Repos Error: {e}")

        if cached is not None:
            return {"repos": cached}

    raise HTTPException(status_code=502, detail=PINNED_UNAVAILABLE)
