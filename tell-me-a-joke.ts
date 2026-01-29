import { CopilotClient, SessionEvent } from "@github/copilot-sdk";

const client = new CopilotClient();
const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureApiKey = process.env.AZURE_OPENAI_API_KEY;
const azureDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;

if (!azureEndpoint || !azureApiKey || !azureDeployment) {
    throw new Error(
        "Missing Azure BYOK configuration. Set AZURE_OPENAI_ENDPOINT, AZURE_OPENAI_API_KEY, and AZURE_OPENAI_DEPLOYMENT."
    );
}

const session = await client.createSession({
    model: azureDeployment,
    provider: {
        type: "azure",
        baseUrl: azureEndpoint,
        apiKey: azureApiKey,
        azure: {
            apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
        },
    },
    streaming: true,
});

// Listen for response chunks
session.on((event: SessionEvent) => {
    // Pretty-print every event for debugging
    console.log(JSON.stringify(event, null, 2));
});

await session.sendAndWait({ prompt: "告訴我一個關於工程師的笑話" });

await client.stop();
process.exit(0);
