# Environment Variables

This project uses environment variables for configuration. All environment variables should be defined in a `.env` file in the frontend root directory.

## Available Environment Variables

### BASE_API_URL
- **Description**: The base URL for all API requests
- **Default**: `http://localhost:8000/api`
- **Example**: `BASE_API_URL=https://api.example.com`

## Usage

1. Create a `.env` file in the frontend root directory:
```bash
# .env
BASE_API_URL=http://localhost:8000/api
```

2. The application will automatically use this URL for all API requests.

## Production Deployment

For production deployments, you should set the `BASE_API_URL` to your production API endpoint:
```bash
# .env.production
BASE_API_URL=https://your-production-api.com/api
```

## Development

During development, the default value of `http://localhost:8000/api` will be used if no `.env` file is present or if the `BASE_API_URL` variable is not defined.