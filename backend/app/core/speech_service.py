from azure.cognitiveservices.speech import (
    SpeechConfig,
    SpeechRecognizer,
    SpeechSynthesizer,
    AudioConfig,
)
import azure.cognitiveservices.speech as speechsdk
import tempfile
from app.config import settings
import logging
import time
import os

# from app.utils.logger import logger
from openai import AzureOpenAI
import base64

logging.basicConfig(level=logging.INFO)


class SpeechService:
    def __init__(self):
        self.config = SpeechConfig(
            subscription=settings.azure_speech_key,
            endpoint=settings.azure_speech_endpoint,
        )

    def text_to_speech(self, text: str, outfile: str = None) -> str:
        if not outfile:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            outfile = tmp.name
        logging.info(f"Creating TTS output file at: {outfile}")
        print(f"Creating TTS output file at: {outfile}")
        audio_cfg = AudioConfig(filename=outfile)
        synth = SpeechSynthesizer(speech_config=self.config, audio_config=audio_cfg)
        print(f"Text to synthesize: {outfile}")
        # synth.speak_text(text)
        return outfile

    def speech_to_text(self, audio_file_path: str, lang_code: str) -> str:
        audio_cfg = AudioConfig(filename=audio_file_path)
        print(            f"Transcribing audio file: {audio_file_path} with language code: {lang_code}")
        self.config.speech_recognition_language = lang_code
        recog = SpeechRecognizer(speech_config=self.config, audio_config=audio_cfg)
        result = recog.recognize_once_async().get()
        print(result.text)
        return result.text


def recognize_from_audio_file(audio_file_path:str, lang_code:str) -> str:

    speech_config = speechsdk.SpeechConfig(subscription=settings.azure_speech_key, region=settings.azure_speech_region)
    speech_config.speech_recognition_language = lang_code

    audio_config = speechsdk.audio.AudioConfig(filename=audio_file_path)

    speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    speech_recognition_result = speech_recognizer.recognize_once_async().get()

    if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
        print("Recognized: {}".format(speech_recognition_result.text))
        return speech_recognition_result.text
    elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
        print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
        return "No speech could be recognized"
    elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
        cancellation_details = speech_recognition_result.cancellation_details
        print("Speech Recognition canceled: {}".format(cancellation_details.reason))
        if cancellation_details.reason == speechsdk.CancellationReason.Error:
            print("Error details: {}".format(cancellation_details.error_details))
            print("Did you set the speech resource key and region values?")
        return "No speech could be recognized"
    return "No speech could be recognized"
    



def synthesize_speech(text, voice_name="en-US-JennyNeural", output_path=None):
    """
    Convert text to speech using Azure Speech Services

    Args:
        text: Text to convert to speech
        voice_name: Voice to use for synthesis
        output_path: Path to save audio file (if None, returns audio data)

    Returns:
        bytes or str: Audio data or path to saved file
    """
    try:
        # Create speech configuration
        speech_config = speechsdk.SpeechConfig(subscription=settings.azure_speech_key, region=settings.azure_speech_region)
        speech_config.speech_synthesis_voice_name = voice_name

        if output_path:
            # Output to file
            audio_config = speechsdk.audio.AudioOutputConfig(filename=output_path)
            speech_synthesizer = SpeechSynthesizer(
                speech_config=speech_config, audio_config=audio_config
            )
            result = speech_synthesizer.speak_text_async(text).get()
            # print(f"Result Reason",result.reason)
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return output_path
                # with open(output_path, "rb") as audio_file:
                #     audio_bytes = audio_file.read()
                #     base64_audio = base64.b64encode(audio_bytes).decode('utf-8')
                #     return base64_audio
            else:
                # logger.error(f"Speech synthesis failed: {result.reason}")
                return None
        else:
            # Output to memory stream
            print(f"Generating audio for text: {text} with voice: {voice_name}")
            speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)
            result = speech_synthesizer.speak_text_async(text).get()
            print(f"Audio data length: {len(result.audio_data)}")
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                return result.audio_data
            else:
                # logger.error(f"Speech synthesis failed: {result.reason}")
                return None
    except Exception as e:
        # logger.error(f"Error in synthesize_speech: {str(e)}")
        return None


def aoai_transcription_from_file(
    audio_file_path: str,
    instructions: str = "Transcribe the audio file into text. Do not answer the question itself. Do not include any additional text in the response",
    audio_format: str = "wav",
    temperature: float = 0.5,
    max_tokens: int = 1500,
    top_p: float = 0.95,
    frequency_penalty: float = 0,
    presence_penalty: float = 0,
) -> str:
    client = AzureOpenAI(
        azure_endpoint=settings.azure_openai_endpoint,
        api_version="2025-01-01-preview",
        api_key=settings.azure_openai_api_key,
    )
    with open(audio_file_path, "rb") as wav_reader:
        encoded_string = base64.b64encode(wav_reader.read()).decode("utf-8")
    # Prepare conversation history
    messages = []

    # Add system message with instructions
    system_message = {
        "role": "system",
        "content": (
            "You are a transcription assistant. You help transcribe audio files into text. "
        ),
    }
    messages.insert(0, system_message)

    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": instructions,
                },
                {
                    "type": "input_audio",
                    "input_audio": {"data": encoded_string, "format": audio_format},
                },
            ],
        }
    )
    try:
        # Generate response using Azure OpenAI
        response = client.chat.completions.create(
            model=settings.azure_openai_audio_model,
            modalities=["text"],
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
        )

        # Extract and return the response text
        if response and response.choices and len(response.choices) > 0:
            text_response = response.choices[0].message.content
        else:
            text_response = "I'm sorry, I couldn't generate a response at this time."
    except Exception as e:
        # logger.error(f"Error in aoai_transcription_from_file: {str(e)}")
        text_response = f"Error during transcription: {str(e)}"
    # Return the transcribed text
    return text_response


def aoai_synthesis_to_file(
    text: str,
    voice_id: str = "alloy",
    output_path: str = None,
    audio_format: str = "wav",
    temperature: float = 0.5,
    max_tokens: int = 1500,
    top_p: float = 0.95,
    frequency_penalty: float = 0,
    presence_penalty: float = 0,
) -> str:
    print(f"Generating audio for text: {text} with voice: {voice_id}")
    client = AzureOpenAI(
        azure_endpoint=settings.azure_openai_endpoint,
        api_version="2025-01-01-preview",
        api_key=settings.azure_openai_api_key,
    )
    messages = []

    # Add system message with instructions
    system_message = {
        "role": "system",
        "content": (
            """
            You are a speech synthesis assistant.
            You will help convert the input text from the user into spoken audio.
            You will not answer any questions or provide any additional information.
            """
        ),
    }
    messages.insert(0, system_message)

    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": text,
                },
            ],
        },
    )
    messages.append(
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please convert the text into audio.",
                },
            ],
        },
    )
    try:
        # Generate response using Azure OpenAI
        response = client.chat.completions.create(
            model=settings.azure_openai_audio_model,
            modalities=["text", "audio"],
            audio={
                "voice": voice_id,
                "format": audio_format,
            },
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
        )

        # Extract and return the response text
        if response and response.choices and len(response.choices) > 0:
            text_response = response.choices[0].message.content
            audio_response = response.choices[0].message.audio
            audio_data = base64.b64decode(audio_response.data)
            with open(output_path, "wb") as f:
                f.write(audio_data)
            print(f"Audio saved to {output_path}")
        else:
            audio_data = None
            text_response = "I'm sorry, I couldn't synthesize the audio at this time."
    except Exception as e:
        # logger.error(f"Error in aoai_synthesis_to_file: {str(e)}")
        text_response = f"Error during transcription: {str(e)}"
        audio_data = None
    # Return the transcribed text
    return text_response, audio_data
