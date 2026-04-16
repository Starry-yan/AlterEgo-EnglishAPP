# Voice Agent Demo Documentation

## Overview

This project demonstrates an **OpenAI Voice Agent** that supports **speech-to-speech** interaction with **text integration**.

- Uses `gpt-4o-mini-realtime-preview` for real-time **voice conversations**.
- Uses `gpt-4o-mini-transcribe` for converting **user speech into text**.
- Both text and speech from the user and the assistant are displayed in the UI.
- This is a **demo template**, **not production-ready**.

⚠️ **Important Limitation**:

- `gpt-4o-mini-transcribe` and `gpt-4o-mini-realtime-preview` **do not sync perfectly**.
- OpenAI currently **does not support combining them seamlessly**.

## Features

- Real-time WebRTC connection to OpenAI Realtime API.
- Audio streaming for **bidirectional voice communication**.
- Text transcripts of both **user queries** and **assistant responses**.
- Microphone toggle to start/stop audio capture.
- Session lifecycle management (start/stop, cleanup).

## 📁 Repository Structure

| Component | Location | Purpose |
|-----------|----------|---------|
| **realtime-voice-agent** | This repo | Complete frontend + WebRTC integration |
| **Backend** | [voice-agent-core](https://github.com/ChaiKeshab/voice-agent-core) | Backend API with batch + realtime endpoints |

## Tech Stack

- **React** (UI + hooks)
- **WebRTC** (peer connection, data channels)
- **OpenAI Realtime API**
- **TypeScript** (for type safety)
- **TailwindCSS** (styling)
- **React Router** (navigation)

## Architecture & Algorithm

### Function Calling Implementation

The agent supports OpenAI's function calling capabilities for enhanced interactivity. Current implementation includes a simple page navigation:

```typescript
export const toolsDefinition = [
    {
        name: "navigate",
        description: "Navigate to a specific page in the app",
        parameters: {
            type: "object",
            properties: {
                page: {
                    type: "string",
                    enum: ["/", "/about"],
                    description: "Page path to navigate to",
                },
            },
            required: ["page"],
        },
    },
];

export const TOOLS = toolsDefinition.map((tool) => ({
    type: "function" as const,
    ...tool,
}));
```

**Assistant Instructions:**

```typescript
export const INSTRUCTIONS = `
You are Alter Ego, an English speaking coach designed to help users practice spoken English through immersive simulation. You are not just a language tutor, but the user's "Ideal Self" avatar in a safe, game-like environment.

### Core Identity & Role
- **Persona:** You are an extremely patient, encouraging, and non-judgmental partner. You never interrupt the user to correct grammar errors. Your primary goal is to build the user's confidence and create a "Psychological Safety Zone" where making mistakes is allowed.
- **Interaction Style:** You are warm, engaging, and use a "Visual-Connection" thinking mode (thinking in images and concepts rather than translating from Chinese).

### Communication Rules (The "Alter Ego" Method)
1. **Response Length:** Keep responses short, conversational, and natural (under 30 words). Do not lecture or explain grammar rules.
2. **The "Recast" Method (Implicit Correction):**
   - If the user makes a grammar mistake (e.g., "I go store yesterday"), do NOT say "Error: should be 'went'".
   - Instead, **repeat the correct structure naturally** in your response to provide "Audio Anchoring".
   - *Example:* User: "I go store yesterday." -> You: "Oh, you **went** to the store? What did you buy?"
3. **Visual & Sensory Anchoring:**
   - When introducing new vocabulary, try to describe it through senses (sight, sound, action) to help the user build direct "Visual-English" connections, bypassing Chinese translation.
   - *Example:* Instead of "The apple is red," say "Look at this shiny red apple. It looks so crisp and juicy."
4. **Scaffolding & Hints:**
   - If the user hesitates or says "I don't know," provide "Audio Echo" hints by repeating the last 2-3 words of your previous sentence.
   - If they are still stuck, offer a "Visual Anchor" hint by describing a relevant object in the scene.

### Scenario Simulation
- You are currently in a 3D simulation environment. You must react to the user's voice commands to trigger actions in the game world.
- Encourage the user to speak English to interact with objects and progress the story.

### Objective
Your ultimate goal is to help the user transition from "Thinking in Chinese" to "Thinking in English" and to make them feel safe enough to speak fluently without fear.
`;
```

For comprehensive function calling documentation, refer to: [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)

### Session Lifecycle

The voice agent follows a structured initialization and communication flow:

1. **Ephemeral Token Generation**:
   - Fetch session credentials from `localhost:8080/api/realtime/session`
   - Extract `client_secret.value` for authentication

2. **WebRTC Setup**:
   - Create `RTCPeerConnection` instance
   - Configure audio element for playback with `autoplay` enabled
   - Set up `ontrack` handler for incoming audio streams
   - Capture user microphone stream via `getUserMedia()`
   - Add microphone tracks to peer connection

3. **Session Initialization**:
   - Create data channel (`oai-events`) for event communication
   - Generate SDP offer using `createOffer()`
   - Exchange SDP with OpenAI Realtime API endpoint
   - Configure session with tools, instructions, and transcription model

4. **Active Communication**:
   - Real-time bidirectional voice interaction
   - Event-driven message handling via WebRTC data channel
   - Microphone toggle functionality (start/stop recording)
   - Live transcript generation and display

5. **Session Cleanup**:
   - Close data channel and peer connection
   - Stop all media tracks and release microphone access
   - Reset all state variables and references

### Synchronization Challenge & Solution

#### Problem Statement

The speech model (`gpt-4o-mini-realtime-preview`) and transcription model (`gpt-4o-mini-transcribe`) operate as separate services without shared session identifiers. This architectural limitation creates race conditions and message ordering issues in the user-agent conversation flow.

#### Technical Solution

Implementation of a **completion state manager** that tracks both model responses and only advances the conversation cycle after receiving final events from both services, ensuring proper message sequencing and chat history integrity.

This approach ensures:

- **Message Ordering**: Prevents conversation flow disruption
- **State Consistency**: Maintains chat history integrity
- **Race Condition Mitigation**: Synchronizes asynchronous model responses

## Implementation Details

### Real-time Event Processing

The system handles multiple WebRTC data channel events:

- `response.audio_transcript.delta`: Live bot response transcript chunks
- `conversation.item.input_audio_transcription.delta`: Live user speech transcription
- `response.done`: Signals completion of assistant response (voice + potential function calls)
- `conversation.item.input_audio_transcription.completed`: User transcription finalization

### Session Configuration

```typescript
const sessionUpdate = {
    type: "session.update",
    session: {
        tools: TOOLS,
        instructions: INSTRUCTIONS,
        "input_audio_transcription": {
            "model": "gpt-4o-mini-transcribe"
        },
        "max_response_output_tokens": 300
    },
};
```

For complete session object specifications and available parameters, refer to the [OpenAI Realtime Session Object Documentation](https://platform.openai.com/docs/api-reference/realtime_sessions/session_object)

### Function Call Execution Flow

1. **Detection**: System identifies function call in `response.done` event
2. **Parsing**: Extract function name and arguments from response
3. **Execution**: Execute corresponding action (e.g., page navigation)
4. **Feedback**: Send completion confirmation back to the model
5. **Response Generation**: Trigger new model response if required

## Usage Flow

1. **Start session** → Creates a WebRTC peer connection with OpenAI.
2. **Start microphone** → Captures user voice.
3. **Send audio** → Transmitted to the Realtime API.
4. **Receive response** →
   - Assistant replies in **voice**.
   - Transcript is displayed as **text**.
   - Function calls executed when requested (e.g., navigation).
5. **Stop session** → Cleans up peer connection and tracks.

## Disclaimer

This is an **experimental demo** meant for learning and exploration. It is **not optimized** for production environments. Expect synchronization issues between voice and text responses due to OpenAI's current API limitations.
