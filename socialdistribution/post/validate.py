from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import uuid
# UserModel = get_user_model()

def custom_validation(data):
    author = data['author']
    author_uuid = author['user_id']
    try:
        uuid.UUID(str(author_uuid))
    except ValueError:
        raise ValidationError("UUID is invalid")
    
    return data
