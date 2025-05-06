from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database configuration
    database_url: str = None
    azure_pubsub_connection: str = None
    azure_pubsub_hub_name: str = None

    # Azure Speech Services
    azure_speech_key: str = None
    azure_speech_endpoint: str = None
    azure_speech_region: str = None

    # Azure OpenAI
    azure_openai_endpoint: str = None
    azure_openai_api_key: str = None
    azure_openai_api_version: str = None
    azure_openai_deployment_name: str = None
    azure_openai_audio_model: str = None
    azure_openai_embedding_deployment_name: str = None

    # Azure AI Search
    azure_search_service_endpoint: str = None
    azure_search_index_name: str = None
    azure_search_api_key: str = None

    # Azure Translator
    azure_translator_endpoint: str = None
    azure_translator_region: str = None
    azure_translator_key: str = None

    class Config:
        env_file = ".env"
        case_sensitive = False  # This allows for case-insensitive env variable matching


settings = Settings()
