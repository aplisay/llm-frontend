import { useQuery } from "react-query";
import { createClient } from "../lib/client";
import { createGreeting, createIntent, updateIntent } from "./intent";
import {
  defaultIntents,
  defaultUnrecognisedIntent,
} from "../templates/intents";

const server = process.env.REACT_APP_AGENT_MANAGEMENT_SERVER;
//const server = "http://localhost:8081";
const api = `${server}/rest/v1/`;

const client = createClient({ prefixUrl: api });

function getAgents() {
  return client("agents");
}
//refer to the comment before getIntent
async function getAgent(key, agentName) {
  let agent = await client(`agents/${agentName}`);
  await checkDefaults({ agentName });
  return agent;
}

async function checkDefaults({ agentName }) {
  let intents = await getIntents([], agentName);
  for (let need of defaultIntents) {
    if (!intents.find((intent) => need.name === intent.name)) {
      await createIntent({ agentName, ...need });
    }
  }
  return;
}

async function updateUnrecognisedIntent({ agentName }) {
  let intents = await getIntents([], agentName);
  let entities = await getEntities([], agentName);
  let examples = intents
    .filter(
      (intent) =>
        intent?.phrases?.length > 0 &&
        !intent.name.match(/(_confirm|_reject|Goodbye)$/)
    )
    .map((intent) => {
      let phrase = intent.phrases[0].replace(
        /\$\{([a-zA-Z][a-zA-Z0-9]+)\}/,
        (match, p1) => {
          let slot = intent.slots.find((slot) => slot.name === p1);
          let entity = entities.find((entity) => entity.name === slot?.entity);
          console.log({ match, p1, slot, entity, entities });
          return entity.kind === "KIND_MAP"
            ? entity.values[Math.round(Math.random(entity.values.length))].value
            : entity.name;
        }
      );
      return `${phrase}, to ${intent.displayName}, `;
    });
  let updatedIntent = {
    ...defaultUnrecognisedIntent,
    emit: [
      ...defaultUnrecognisedIntent.emit,
      [`I understand things like: ${examples}`],
    ],
  };
  return updateIntent({
    agentName,
    intentName: updatedIntent.name,
    ...updatedIntent,
  });
}

function createAgent(agent, defaultIntents) {
  return client("agents", {
    method: "POST",
    body: agent,
  }).then(async (created) => {
    let agentSpec = { agentName: agent.name };
    await createGreeting(agentSpec);
    await checkDefaults(agentSpec);
    return agent;
  });
}

function updateAgent({ agentName, ...newAgentNames }) {
  return client(`agents/${agentName}`, {
    method: "PUT",
    body: newAgentNames,
  });
}

function deleteAgent(agentName) {
  return client(`agents/${agentName}`, {
    method: "DELETE",
  });
}

// Super dangerous wipe all agents
async function clearAgents() {
  return Promise.all(
    (await getAgents()).map((agent) => deleteAgent(agent.name))
  );
}
//refer to the comment before getIntent
function getIntents(key, agentName) {
  return client(`intents/${agentName}`).then((intents) => {
    console.log({ intents });
    return intents;
  });
}

//useQuery from react-query takes an array as its first argument, something like this ["intents", "legolas", "greeting"]
//the first value in the array is a key for react query, but the others can be any data
//these values get passed in as arguments to the function that gets data (getIntent)
function getIntent(key, agentName, intentName) {
  return client(`intents/${agentName}/${intentName}`);
}

function deleteIntent({ agentName, mainIntent }) {
  return client(`intents/${agentName}/${mainIntent.name}`, {
    method: "DELETE",
  }).then(() => {
    return client(`intents/${agentName}/${mainIntent.name}_confirm`, {
      method: "DELETE",
    }).then(() => {
      return client(`intents/${agentName}/${mainIntent.name}_reject`, {
        method: "DELETE",
      });
    });
  });
}

function createEntity({ agentName, entity }) {
  return client(`entities/${agentName}`, {
    method: "POST",
    body: entity,
  });
}

function getEntities(key, agentName) {
  return client(`entities/${agentName}`);
}

function getEntity(key, agentName, entityName) {
  return client(`entities/${agentName}/${entityName}`);
}

function updateEntity({ agentName, entity }) {
  return client(`entities/${agentName}/${entity.name}`, {
    method: "PUT",
    body: entity,
  });
}

function deleteEntity({ agentName, entityName }) {
  return client(`entities/${agentName}/${entityName}`, {
    method: "DELETE",
  });
}

async function publishAgent({ agentName }) {
  await updateUnrecognisedIntent({ agentName });
  return client(`agents/${agentName}/publish/dialogflow`, {
    method: "PUT",
  });
}
//separate function because we use this in a useQuery, whereas sendTestMessage is a mutation
function initialiseTestInterface(key, agentName, serviceName, message) {
  return client(`agents/${agentName}/test/${serviceName}`, {
    method: "POST",
    body: message,
  });
}

function sendTestMessage({ agentName, serviceName, message }) {
  return client(`agents/${agentName}/test/${serviceName}`, {
    method: "POST",
    body: message,
  });
}

function useAgentProgress({ agentName }) {
  const { status: agentsStatus, data: agents } = useQuery("agents", getAgents);
  const { status: intentsStatus, data: intents } = useQuery(
    ["intents", agentName],
    getIntents
  );
  let progress = {
    hasName: agentName && agentName !== "new",
    hasGreetings: false,
    hasRequests: false,
    hasResponses: false,
    unpublished: false,
  };
  if (agentsStatus !== "success") return progress;
  if (intentsStatus !== "success") return progress;

  const agent = agents.find((agent) => agent.name === agentName);
  const greeting = intents.find((intent) => intent.isWelcome);
  const intent = intents.find(
    (intent) =>
      !intent.isWelcome &&
      !intent.isFallback &&
      !/_confirm$|_reject$/.test(intent.name)
  );

  progress.unpublished = !!agent?.unpublished;
  progress.hasGreetings = !!greeting?.emit?.length;
  progress.hasRequests = !!intent?.phrases?.length;
  progress.hasResponses = !!intent?.emit?.length;

  return progress;
}

export {
  getAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  clearAgents,
  getIntents,
  getIntent,
  deleteIntent,
  createEntity,
  getEntities,
  getEntity,
  updateEntity,
  deleteEntity,
  publishAgent,
  initialiseTestInterface,
  sendTestMessage,
  updateUnrecognisedIntent,
  useAgentProgress,
};
