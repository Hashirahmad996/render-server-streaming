# Pusher Webhook Forwarding Server

This is a simple Node.js application that acts as a secure webhook receiver to forward events to Pusher.

## Use Case

This server is designed to be a bridge between a service that can send webhooks (like GitHub Actions, a CI/CD pipeline, or a custom backend service) and your frontend application that listens for real-time events with Pusher.

Instead of exposing your Pusher credentials directly in your CI/CD environment, you can have your pipeline send a webhook to this server. This server, which securely stores your Pusher credentials, will then relay the event to the appropriate Pusher channel.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/render-server-streaming.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** and add your Pusher credentials. You can copy the `.env.example` file if one exists.
    ```
    PUSHER_APP_ID="your_app_id"
    PUSHER_APP_KEY="your_key"
    PUSHER_SECRET="your_secret"
    PUSHER_CLUSTER="your_cluster"
    ```

4.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3000`.

## API Endpoint

### `POST /trigger-event`

Receives a webhook payload and forwards it as an event to one or more Pusher channels.

**Request Body:**

The request body must be a JSON object with the following fields:

-   `channels` (Array of strings): A list of Pusher channels to send the event to.
-   `name` (string): The name of the event.
-   `data` (object): The JSON payload to send with the event.

**Example Payload:**

```json
{
  "channels": ["my-channel"],
  "name": "log-update",
  "data": {
    "message": "Deployment step 1/3: Cloning repository..."
  }
}
```

**Example `curl` Request:**

```bash
curl -X POST \
  http://localhost:3000/trigger-event \
  -H 'Content-Type: application/json' \
  -d '{
        "channels": ["my-channel"],
        "name": "log-update",
        "data": { "message": "Hello from curl!" }
      }'
```

**Success Response (200 OK):**

```json
{
  "message": "Event forwarded successfully to Pusher."
}
```

**Error Response (400 Bad Request):**

If the request body is missing required fields.
```json
{
  "error": "Request body must include \"channels\", \"name\", and \"data\" fields."
}
```
