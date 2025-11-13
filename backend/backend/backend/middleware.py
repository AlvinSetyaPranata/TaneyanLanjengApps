from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import AccessToken
from django.http import HttpResponse
import json


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to handle JWT authentication and provide consistent 401 responses
    """
    
    def process_response(self, request, response):
        # If response is 401 Unauthorized, ensure consistent JSON format for API requests
        if response.status_code == 401:
            # For API requests, return a consistent JSON response
            if request.path.startswith('/api/'):
                # Check if it's already a JSON response with detail
                content = response.content.decode('utf-8') if hasattr(response, 'content') else ''
                if '"detail":' in content or not response.get('Content-Type', '').startswith('application/json'):
                    return JsonResponse({
                        'error': 'Authentication required',
                        'code': 'authentication_required',
                        'message': 'Token is invalid or expired',
                        'redirect': '/login'
                    }, status=401)
        
        return response