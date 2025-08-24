# Render Server Streaming with Pusher

This is a Node.js application that demonstrates how to use server-sent events (SSE) with Pusher to stream deployment logs to the client.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/render-server-streaming.git
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `app.env` file** and add your Pusher credentials:

   ```
   PUSHER_APP_ID="your_app_id"
   PUSHER_KEY="your_key"
   PUSHER_SECRET="your_secret"
   PUSHER_CLUSTER="your_cluster"
   ```

4. **Start the server:**

   ```bash
   npm start
   ```

The server will be running at `http://localhost:3000`.

## API Endpoints

- `GET /deployments/:id/stream`: Stream deployment logs for a given deployment ID.
