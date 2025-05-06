import base64
from fastapi import APIRouter,HTTPException, Depends
from app.core.pubsub import PubSubClient
from app.core.speech_service import SpeechService
from app.utils.fs_utils import create_temp_file, get_temp_file_path
from app.models.schemas import EmployeeMessagePayload
import uuid

# from app.utils.logger import logger

from app.models.schemas import (
    TranscriptionRequest,
    TranscriptionResponse
)
from app.core.speech_service import (
    recognize_from_audio_file,
    aoai_synthesis_to_file,
    aoai_transcription_from_file,
    synthesize_speech,
)

router = APIRouter()
speechservice = SpeechService()

# Dependency to initialize PubSubClient
def get_pubsub_client():
    return PubSubClient()

@router.post("/stt")
def get_audio_transcription(
    request: TranscriptionRequest,
):
    try:
        response = TranscriptionResponse(text="Not Implemented Error", confidence=None)

        audio_bytes = request.audio_base64.strip("data:audio/wav;base64,")
        audio_bytes = base64.b64decode(audio_bytes)
        audio_file = create_temp_file(
            prefix="input_audio_", suffix=".wav", content=audio_bytes
        )

        language_code = "en-US"
        mode ="azure_speech"
        # print("Audio file path:", audio_file)
        if mode == "azure_speech":
            print("Transcribing using Azure Speech Service")
            
            transcription = recognize_from_audio_file(audio_file_path=audio_file,lang_code=language_code)
            response.text = transcription
            response.confidence = None
        elif mode == "whisper":
            # TODO: Implement whisper transcription logic
            pass
        elif mode == "gpt-4o-audio-preview":
            transcription = aoai_transcription_from_file(
                audio_file_path=audio_file,
            )
            response.text = transcription
            response.confidence = None
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")



@router.post("/tts")
def handle_approvedmsg(
    request: EmployeeMessagePayload,
    pubsub_client: PubSubClient = Depends(get_pubsub_client)
):

    grpname = request.group_name
    user_id = request.user_id
    employee_approved_msg = request.employee_approved_msg
    
    print("employee_approved_msg = ",employee_approved_msg)
    message_id = "ai-"+ str(uuid.uuid4())
    messageinfo = {"message_id": message_id, "language": "en", "sender": "KWSP Employee"}
    pubsub_client.send_to_group(
        group=grpname,
        data={"sender": "KWSP Employee",
              "message": f"{employee_approved_msg}",
              "messageinfo":messageinfo}
    )
    audio_temp_file = get_temp_file_path()
    employee_approved_msg_audio_path = synthesize_speech(
        text=employee_approved_msg, voice_name="en-US-JennyNeural",output_path=audio_temp_file)
    
    chunk_size = 800_000  # bytes
    with open(employee_approved_msg_audio_path,"rb") as f:
        idx = 0
        while True:
            chunk = f.read(chunk_size)
            if not chunk:
                break
            # tag each chunk with an order index if you like
            pubsub_client.send_to_group(group=grpname,
                                        data=chunk, 
                                        content_type="application/octet-stream")
            idx += 1
    # if not grpname or not user_id or not user_qry:
    #     raise HTTPException(status_code=400, detail="Missing required fields")
    # pubsub_client.send_to_group(
    #         group=grpname,
    #         data="AudioChunk Successfully sent",content_type="text/plain",
    #         )
    pubsub_client.send_to_group(
        group=grpname,
        data={"sender": "SystemMessage",
              "message": "AudioChunk Successfully sent",
              "messageinfo":messageinfo}
    )

    # )
    return {"status": "approved"}


# @router.post("/tts")
# async def get_speech_synth(request: SynthesisRequest) -> SynthesisResponse:
#     """
#     Synthesize text to speech.

#     Parameters:
#     - text: Text to synthesize
#     - voice_id: Optional voice identifier
#     - options: Additional synthesis options

#     Returns:
#     - Audio data or URL to synthesized speech
#     """
#     try:
#         response = SynthesisResponse(audio_data=b"", audio_url=None)
#         mode = (
#             request.options.get("mode", "azure_speech")
#             if request.options
#             else "azure_speech"
#         )
#         output_path = create_temp_file(
#             prefix="output_audio_", suffix=".wav", content=None
#         )
#         if mode == "azure_speech":
#             voice_id = request.voice_id or "en-US-JennyNeural"
#             output_path = synthesize_speech(
#                 text=request.text,
#                 voice_name=voice_id,
#                 output_path=output_path,
#             )
#             response.audio_data = base64.b64encode(
#                 open(output_path, "rb").read()
#             )  # .decode("utf-8")

#             response.audio_url = output_path
#         elif mode == "gpt-4o-audio-preview":
#             voice_id = request.voice_id or "alloy"
#             text_response, audio_data = aoai_synthesis_to_file(
#                 text=request.text,
#                 voice_id=voice_id,
#                 output_path=output_path,
#             )
#             response.audio_data = base64.b64encode(audio_data)
#             response.audio_url = output_path
#         elif mode == "tts":
#             # TODO: Implement TTS synthesis logic
#             pass

#         return response
#     except Exception as e:
#         raise HTTPException(
#             status_code=500, detail=f"Error synthesizing speech: {str(e)}"
#         )


# @router.post("/translatetext", response_model=TranslateResponse)
# async def translate(req: TranslateRequest):
#     translated = await translate_text(
#         text=req.text, src_lang=req.src_lang, tgt_lang=req.tgt_lang
#     )
#     return {"translated_text": translated}
