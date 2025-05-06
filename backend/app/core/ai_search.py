# from azure.core.credentials import AzureKeyCredential
# from azure.search.documents.aio import SearchClient
# from app.config import settings


# class AISearchClient:
#     def __init__(self, index_name: str):
#         self.client = SearchClient(
#             endpoint=settings.azure_search_service_endpoint,
#             index_name=settings.azure_search_index_name,
#             credential=AzureKeyCredential(settings.azure_search_api_key),
#         )

#     async def search_faq(self, query: str, top_k: int = 5) -> list:
#         results = self.client.search(search_text=query, top=top_k)
#         return [doc for doc in results]
