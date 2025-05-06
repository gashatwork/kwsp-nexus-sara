import json
import logging
from azure.messaging.webpubsubservice import WebPubSubServiceClient
from azure.core.exceptions import AzureError
from app.config import settings

logger = logging.getLogger(__name__)

class PubSubClient:
    def __init__(self):
        try:
            self.client = WebPubSubServiceClient.from_connection_string(
                settings.azure_pubsub_connection, hub=settings.azure_pubsub_hub_name
            )
        except AzureError as e:
            logger.error("Failed to initialize WebPubSubServiceClient: %s", str(e))
            raise
    
    def get_client_access_token(self, user_id: str, roles: list):
        try:
            return self.client.get_client_access_token(user_id=user_id, roles=roles)
        except AzureError as e:
            logger.error("Failed to get client access token for user '%s': %s", user_id, str(e))
            raise

    def send_to_group(self, group: str, data: dict, content_type="application/json"):
        try:
            # print("Sending message to group: %s", group)
            # print("Sending data", data)
            self.client.send_to_group(
                group=group,
                message=data,
                content_type=content_type
            )
            logger.info("Message sent to group '%s'", group)
        except AzureError as e:
            logger.error("Failed to send message to group '%s': %s", group, str(e))
            raise
    
    def add_user_to_group(self, connection_id: str, group: str):
        try:
            self.client.add_user_to_group(
                user_id=connection_id,
                group=group,
            )
            logger.info("User '%s' added to group '%s'", connection_id, group)
        except AzureError as e:
            logger.error("Failed to add user '%s' to group '%s': %s", connection_id, group, str(e))
            raise