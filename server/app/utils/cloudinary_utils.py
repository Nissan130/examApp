import cloudinary
import cloudinary.uploader
import cloudinary.api
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(file, folder="exam-app"):
    result = cloudinary.uploader.upload(file, folder=folder)
    return {"url": result["secure_url"], "public_id": result["public_id"]}

def delete_image(public_id):
    return cloudinary.uploader.destroy(public_id)
