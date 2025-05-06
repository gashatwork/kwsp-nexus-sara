# import azure.cognitiveservices.speech as speechsdk

# def from_file():
#     speech_config = speechsdk.SpeechConfig(region="eastus",
#                                            subscription="GfjOgxo7XyM8MRCIHgTPafmFN0b4uFnfEVPXqDXdvqAzSeDpZXCo")
    
#     audio_config = speechsdk.AudioConfig(filename="C:\WORK\wincode\ai-voice-nexus\backend\tests\test_audio_story_request-output.wav")
#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

#     speech_recognition_result = speech_recognizer.recognize_once_async().get()
#     print(speech_recognition_result.text)

# from_file()


import pandas as pd
csv_file_path = "KWSPProfileData.csv"
df = pd.read_csv(csv_file_path)
print(df.head())
print(df.columns)
print(df.dtypes)
# Filter the data for the given user ID
user_data = df[df["user_id"] == 2]
print(user_data)
# import os
# import azure.cognitiveservices.speech as speechsdk

# def recognize_from_audio_file():
#     # Replace 'my_key' and 'my_region' with your actual subscription key and region
#     my_key = "7jCTSb5V5O4wQqQarIpuzBd6P5rcrL69jrLke7W9UKrH8zXd9j0IJQQJ99BDACqBBLyXJ3w3AAAEACOGB9XS"
#     my_region = "eastus"


#     speech_config = speechsdk.SpeechConfig(subscription=my_key, region=my_region)
#     speech_config.speech_recognition_language = "en-US"

#     # Provide the path to your WAV audio file
#     audio_file_path = r"C:\WORK\wincode\ai-voice-nexus\backend\tests\test_audio_story_request-output.wav"
#     audio_config = speechsdk.audio.AudioConfig(filename=audio_file_path)

#     speech_recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

#     speech_recognition_result = speech_recognizer.recognize_once_async().get()

#     if speech_recognition_result.reason == speechsdk.ResultReason.RecognizedSpeech:
#         print("Recognized: {}".format(speech_recognition_result.text))
#     elif speech_recognition_result.reason == speechsdk.ResultReason.NoMatch:
#         print("No speech could be recognized: {}".format(speech_recognition_result.no_match_details))
#     elif speech_recognition_result.reason == speechsdk.ResultReason.Canceled:
#         cancellation_details = speech_recognition_result.cancellation_details
#         print("Speech Recognition canceled: {}".format(cancellation_details.reason))
#         if cancellation_details.reason == speechsdk.CancellationReason.Error:
#             print("Error details: {}".format(cancellation_details.error_details))
#             print("Did you set the speech resource key and region values?")

# recognize_from_audio_file()