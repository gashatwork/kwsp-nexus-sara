from openai import AzureOpenAI
from app.config import settings

SYSTEM_PROMPT = """
You are a helpful assistant that can answer questions based on the provided context. The context is a collection of documents from Malaysia KWSP Products and FAQ. Queries might be related to the following topics:
- KWSP Products
- KWSP FAQ
- KWSP Services for Non-Malaysians , Migrant Workers, and Foreigners
You retrieve Malay documents and you should read them carefully in Malay and answer in English.
"""

class ProductRecommendationService:
    def __init__(self, additional_query_parameters=None):
        self.client = AzureOpenAI(
            azure_endpoint=settings.azure_openai_endpoint,
            api_version=settings.azure_openai_api_version,
            api_key=settings.azure_openai_api_key,
        )
        self.deployment_name = settings.azure_openai_deployment_name
        self.additional_query_parameters = {
            "query_type": "vector_semantic_hybrid",
            "strictness": 1,
            "top_n_documents": 5,
        }

    def get_search_configs(self):
        search_config = {
            "data_sources": [
                {
                    "type": "azure_search",
                    "parameters": {
                        "endpoint": settings.azure_search_service_endpoint,
                        "authentication": {
                            "type": "api_key",
                            "key": settings.azure_search_api_key,
                        },
                        "index_name": settings.azure_search_index_name,
                        "embedding_dependency": {
                            "type": "deployment_name",
                            "deployment_name": settings.azure_openai_embedding_deployment_name,
                            "dimensions": 3072,
                        },
                        "semantic_configuration": "default",
                        "query_type": self.additional_query_parameters.get(
                            "query_type", "vector_simple_hybrid"
                        ),
                        "strictness": self.additional_query_parameters.get(
                            "strictness", 1
                        ),
                        "top_n_documents": self.additional_query_parameters.get(
                            "top_n_documents", 5
                        ),
                        "fields_mapping":{"content_fields": ["content"],"vector_fields": ["embedding"],"filepath_field":"storageUrl"},  
                    },
                }
            ],
        }
        return search_config

    def get_starter_message_list(self, prompt: str):
        messages = []
        messages.append({"role": "system", "content": SYSTEM_PROMPT})
        messages.append({"role": "user", "content": prompt})
        return messages

    def call(self, prompt: str) -> str:
        messages = self.get_starter_message_list(prompt)
        resp = self.client.chat.completions.create(
            model=self.deployment_name,
            messages=messages,
            extra_body=self.get_search_configs(),
        )
        print("Response from AI :", resp.choices[0])
        return resp.choices[0].message.content