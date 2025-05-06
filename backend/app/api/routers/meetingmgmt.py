from fastapi import APIRouter
# from typing import List
# from app.core.ai_search import AISearchClient
from pydantic import BaseModel
from fastapi import HTTPException
from app.models.schemas import (
    ProductRecommendationRequest,
    ProductRecommendationResponse, VerifyUserRequest
)
from app.core.chat_recommendation import ProductRecommendationService
import pandas as pd
import random
# class SearchResult(BaseModel):
#     id: str
#     content: dict


router = APIRouter()
# product_recommendation_service = ProductRecommendationService()


# @router.post("/productrecommend", response_model=ProductRecommendationResponse)
# async def generate_answers(
#     request: ProductRecommendationRequest,
# ) -> ProductRecommendationResponse:
#     """
#     Generate answers to questions.

#     Parameters:
#     - question: The question to answer
#     - options: Additional query options

#     Returns:
#     - Generated answer
#     """
#     try:
#         response = ProductRecommendationResponse(
#             output="Not Implemented Error", metadata=None
#         )

#         response.output = product_recommendation_service.call(prompt=request.input)
#         return response
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Error generating answer: {str(e)}"
#         )

from app.models.schemas import UserProfileResponse  # Ensure this is correctly imported

@router.post("/verifyuser")
def verify_get_user_profile(
request: VerifyUserRequest,
):
    """
    Verify user and fetch profile data from a local CSV file.

    Parameters:
    - request: VerifyUserRequest containing the user ID.

    Returns:
    - UserProfileResponse with user profile data.
    """
    try:
        # Load the CSV file
        csv_file_path = "KWSPProfileData.csv"
        df = pd.read_csv(csv_file_path)
        df.columns = df.columns.str.lower()
        df = df.rename(columns=lambda x: x.lower())
        user_id = request.user_id
        print(repr(user_id))
        print(f"Unique user_ids in DataFrame: {repr(df['user_id'].unique())}")
        # Clean the user_id column and the input user_id
        # df["user_id"] = df["user_id"].str.strip().str.lower()  # Remove whitespace and normalize case
        # user_id = user_id.strip().lower()  # Normalize input user_id

        # Debugging: Print the values for verification
        # print(f"Unique user_ids in DataFrame: {repr(df['user_id'].unique())}")
        # print(f"Input user_id: {repr(user_id)}")

        # Filter the data for the given user ID
        user_data = df[df["user_id"] == eval(user_id)]
        print(f"Filtered user_data: {repr(user_data)}")
        if user_data.empty:
            raise HTTPException(
                status_code=404, detail="User ID not found in the profile data."
            )

        # Convert the user data to a dictionary
        user_profile = user_data.to_dict(orient="records")[0]
        
        user_profile["meetingcode"] = get_meeting_code()  # Generate meeting code
        print(f"User profile data: {user_profile}")
        # Create the response
        # response = UserProfileResponse(**user_profile)
        return user_profile
    except FileNotFoundError:
        raise HTTPException(
            status_code=500, detail="Profile data file not found."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching user profile: {str(e)}"
        )



def get_meeting_code():
    """
    Verify user and fetch profile data from a local CSV file.

    Parameters:
    - request: VerifyUserRequest containing the user ID.

    Returns:
    - UserProfileResponse with user profile data.
    """
    try:
        # Simple random code generator (example: 8-character alphanumeric)
        chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
        code = "".join(random.choice(chars) for _ in range(8))
        return code
    
    except FileNotFoundError:
        raise HTTPException(
            status_code=500, detail="Profile data file not found."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching user profile: {str(e)}"
        )