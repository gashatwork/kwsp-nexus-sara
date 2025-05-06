from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from app.core.pubsub import PubSubClient
from app.core.chat_recommendation import ProductRecommendationService
from app.config import settings
from app.models.schemas import UserMessagePayload, EmployeeMessagePayload
import uuid
router = APIRouter()

# Dependency to initialize PubSubClient
def get_pubsub_client():
    return PubSubClient()

# Dependency to initialize ProductRecommendationService
def get_recommendation_service():
    return ProductRecommendationService()

@router.post("/usermsg")
def handle_usermsg(
    request: UserMessagePayload,
    background_tasks: BackgroundTasks,
    pubsub_client: PubSubClient = Depends(get_pubsub_client),
    recommendation_service: ProductRecommendationService = Depends(get_recommendation_service),
):

    # pubsub_client: PubSubClient = Depends(get_pubsub_client)
    # recommendation_service: ProductRecommendationService = Depends(get_recommendation_service)

    grpname = request.group_name
    user_id = request.user_id
    user_qry = request.user_qry

    if not grpname or not user_id or not user_qry:
        raise HTTPException(status_code=400, detail="Missing required fields")

    # Send the original message to the group immediately
    message_id = "user-"+ str(uuid.uuid4())
    messageinfo = {"message_id": message_id, "language": "en", "sender": "User"}


    pubsub_client.send_to_group(
        group=grpname,
        data={"sender": "Client", "message": f"{user_qry}", "messageinfo": messageinfo},
    )

    # Offload AI processing to a background task
    background_tasks.add_task(
        process_and_publish_ai_response, grpname, user_qry, pubsub_client, recommendation_service
    )
    return {"status": "processing"}

def process_and_publish_ai_response(
    grpname: str,
    user_qry: str,
    pubsub_client: PubSubClient,
    recommendation_service: ProductRecommendationService
    ):
    # Process the audio message using ProductRecommendationService
    ai_response = recommendation_service.call(user_qry)
    # Send the original message to the group immediately
    message_id = "user-"+ str(uuid.uuid4())
    messageinfo = {"message_id": message_id, "language": "en", "sender": "User"}
    # Send the AI response to the group
    pubsub_client.send_to_group(
        group=grpname,
        data={"sender": "AiMessageNew", "message": ai_response, "messageinfo": messageinfo}
    )

@router.get("/negotiate")
def negotiate(
    user_id: str = Query(..., description="The user ID"),
    group_name: str = Query(..., description="The group name"),
):
    pubsub_client = get_pubsub_client()
    if not user_id:
        raise HTTPException(status_code=400, detail="Missing user ID")

    try:
        # Use the PubSubClient to get the client access token
        token = pubsub_client.get_client_access_token(
            user_id=user_id,
            roles=[
                f"webpubsub.joinLeaveGroup.{group_name}",
                f"webpubsub.sendToGroup.{group_name}",
            ],
        )
        return {"url": token["url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to negotiate: {str(e)}")
    


