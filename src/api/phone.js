import { createClient } from "./client";
import { publishAgent } from "./agent";

const server = process.env.REACT_APP_BACKEND_SERVER;

const client = createClient({ prefixUrl: server });

function getAvailablePhoneNumbers() {
  return client("/api/agent/phone-numbers");
}

function getPhoneNumber(unique_id) {
  if (!unique_id) return [];
  return client(`/api/agent/phone-numbers/${unique_id}`);
}

function linkAgentInterface({ unique_id, interfaceId }) {
  return client("/api/agent/phone-numbers/link", {
    method: "PUT",
    body: {
      interfaceId,
      agentId: unique_id,
    },
  });
}

function unlinkAgentInterface({ unique_id, interfaceId }) {
  return client("/api/agent/phone-numbers/unlink", {
    method: "PUT",
    body: {
      interfaceId,
      agentId: unique_id,
    },
  });
}

function linkSpreadsheet({
  interfaceId,
  spreadsheetName,
  spreadsheetId,
  spreadsheetSheet,
}) {
  return client(`/api/agent/phone-numbers/data/${interfaceId}`, {
    method: "PUT",
    body: {
      spreadsheetName,
      spreadsheetId,
      spreadsheetSheet,
    },
  });
}

async function publish({
  agentName,
  unique_id,
  interfaceId,
  spreadsheetName,
  spreadsheetId,
  spreadsheetSheet,
}) {
  await linkAgentInterface({ unique_id, interfaceId });
  try {
    await linkSpreadsheet({
      interfaceId,
      spreadsheetId,
      spreadsheetName,
      spreadsheetSheet,
    });
    const response = await publishAgent({ agentName });
    return response;
  } catch (error) {
    await unlinkAgentInterface({ unique_id, interfaceId });
    throw error;
  }
}

export {
  getAvailablePhoneNumbers,
  getPhoneNumber,
  publish,
  unlinkAgentInterface,
};
