```plaintext
backend/
├── app/                    # Application package
│   ├── __init__.py
│   ├── main.py             # FastAPI entrypoint
│   ├── config.py           # Settings (pydantic)
│   ├── api/                # API routers
│   │   ├── __init__.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── chat.py
│   │       ├── translation.py
│   │       ├── recommendations.py
│   │       ├── tts_stt_translation.py
│   ├── core/               # Azure & AI integrations &  # Business logic
│   │   ├── __init__.py
│   │   ├── pubsub.py
│   │   ├── chat_recommednation.py
│   │   ├── speech_service.py
│   │   ├── ai_search.py
│   ├── db/                 # CosmosDB client, migrations
│   │   ├── __init__.py
│   │   └── client.py
│   ├── models/             # Pydantic schemas & ORM models
│   │   ├── __init__.py
│   │   ├── schemas.py
│   │   └── db_models.py
│   └── utils/              # Helpers & logging
│       ├── __init__.py
│       └── logger.py
├── tests/                  # Unit & integration tests
│   └── test_translation.py
├── .env.example            # Sample environment variables
├── requirements.txt        # Dependencies
├── Dockerfile              # Containerization
└── azure-pipelines.yml     # CI/CD pipeline
```

## Start app 
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload