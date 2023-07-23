import { useQuery, useMutation, queryCache } from "react-query";
import { createClient } from "../lib/client";

import {
  initialConfirmIntent,
  initialRejectIntent,
} from "../templates/intents";

const prefixUrl = process.env.REACT_APP_AGENT_MANAGEMENT_SERVER + "/rest/v1/";

const client = createClient({ prefixUrl });

async function createIntent({
  agentName,
  name,
  displayName,
  confirm = true,
  ...body
}) {
  if (confirm) {
    await client(`intents/${agentName}`, {
      method: "POST",
      body: {
        ...initialConfirmIntent,
        name: name + "_confirm",
        displayName: name + "_confirm",
        inputContexts: [name + "_confirmation"],
        outputContexts: ["default"],
      },
    });
    await client(`intents/${agentName}`, {
      method: "POST",
      body: {
        ...initialRejectIntent,
        name: name + "_reject",
        displayName: name + "_reject",
        inputContexts: [name + "_confirmation"],
      },
    });
  }
  return await client(`intents/${agentName}`, {
    method: "POST",
    body: { name, displayName, ...body },
  });
}

function useCreateIntent() {
  return useMutation(createIntent, {
    onSuccess: (data, { agentName, name }) => {
      queryCache.setQueryData(["intent", agentName, name], data);
      queryCache.invalidateQueries(["intents", agentName], {
        refetchInactive: true,
      });
    },
  });
}

function createGreeting({ agentName }) {
  client(`intents/${agentName}`, {
    method: "POST",
    body: {
      name: "greeting",
      displayName: "Greeting",
      description: "How the agent answers the phone",
      emit: [],
      isWelcome: true,
    },
  });
}

function getIntent(key, agentName, intentName) {
  return client(`intents/${agentName}/${intentName}`);
}

function useGetIntent({ agentName, intentName }) {
  return useQuery(["intent", agentName, intentName], getIntent, {
    initialData: () => {
      const intent = queryCache.getQueryData(["intent", agentName, intentName]);
      if (intent) {
        return intent;
      } else {
        const allIntents = queryCache.getQueryData(["intents", agentName]);
        return allIntents?.find((intent) => intent.name === intentName);
      }
    },
  });
}

function getNewIntent(intent, action) {
  switch (action.type) {
    case "add_name":
      return {
        ...intent,
        name: action.name,
        displayName: action.displayName,
      };
    case "add_phrase":
      return {
        ...intent,
        phrases: [...intent.phrases, action.phrase],
      };
    case "delete_phrase":
      return {
        ...intent,
        phrases: [
          ...intent.phrases.slice(0, action.index),
          ...intent.phrases.slice(action.index + 1),
        ],
      };
    case "edit_phrase": {
      const newPhrases = [...intent.phrases];
      newPhrases[action.index] = action.value;
      return {
        ...intent,
        phrases: newPhrases,
      };
    }
    case "add_slot":
      return {
        ...intent,
        slots: [...intent.slots, action.slot],
      };
    case "delete_slot":
      let newSlots = [...intent.slots];
      newSlots.splice(action.index, 1);
      return {
        ...intent,
        slots: newSlots,
      };
    case "replace_highlight_with_slot_name":
      return {
        ...intent,
        phrases: intent.phrases.map((phrase, index) =>
          index === action.phraseIndex
            ? phrase.replace(action.highlight, "${" + action.slotName + "}")
            : phrase
        ),
      };
    case "replace_emit_highlight_with_slot_name":
      const [responses = [], ...rest] = intent.emit;
      const newResponses = responses.map((phrase, index) =>
        index === action.phraseIndex
          ? phrase.replace(action.highlight, "${" + action.slotName + "}")
          : phrase
      );
      return {
        ...intent,
        emit: [newResponses, ...rest],
      };
    case "toggle_mandatory_slot": {
      const newSlots = intent.slots.map((slot, index) =>
        index === action.slotIndex
          ? {
              ...slot,
              mandatory: action.mandatoryBoolean,
            }
          : slot
      );
      return {
        ...intent,
        slots: newSlots,
      };
    }
    case "add_prompt": {
      //create a newSlots array which updates the prompts for the slot whose name matches action.name
      //action.slotName is the slot for which the user just entered prompts
      const newSlots = intent.slots.map((slot) =>
        slot.name === action.slotName
          ? {
              ...slot,
              mandatory: true,
              prompts: slot.prompts
                ? [...slot.prompts, action.prompt]
                : [action.prompt],
            }
          : slot
      );
      return {
        ...intent,
        slots: newSlots,
      };
    }
    case "delete_prompt": {
      const newSlots = intent.slots.map((slot) =>
        slot.name === action.slotName
          ? {
              ...slot,
              mandatory: true,
              prompts: [
                ...slot.prompts.slice(0, action.index),
                ...slot.prompts.slice(action.index + 1),
              ],
            }
          : slot
      );
      return {
        ...intent,
        slots: newSlots,
      };
    }
    case "edit_prompt": {
      const newSlots = intent.slots.map((slot) => {
        if (slot.name === action.slotName) {
          const newPrompts = [...slot.prompts];
          newPrompts[action.index] = action.value;
          return {
            ...slot,
            prompts: newPrompts,
          };
        } else {
          return slot;
        }
      });
      return {
        ...intent,
        slots: newSlots,
      };
    }
    case "add_emit": {
      const [responses = [], ...rest] = intent.emit;
      return {
        ...intent,
        emit: [[...responses, action.value], ...rest],
      };
    }
    case "set_emit":
      return {
        ...intent,
        emit: action.responses,
      };
    case "delete_emit": {
      const [responses = [], ...rest] = intent.emit;
      const newResponses = [
        ...responses.slice(0, action.index),
        ...responses.slice(action.index + 1),
      ];
      return {
        ...intent,
        emit: [newResponses, ...rest],
      };
    }
    case "edit_emit": {
      const [newResponses = [], ...rest] = intent.emit;
      newResponses[action.index] = action.value;
      return {
        ...intent,
        emit: [newResponses, ...rest],
      };
    }
    case "toggle_confirmations":
      return {
        ...intent,
        outputContexts: action.enabled ? [intent.name + "_confirmation"] : [],
        emit: action.responses,
      };
    case "toggle_end_conversation":
      return {
        ...intent,
        isTerminal: action.endConversation,
      };
    case "add_goodbye_or_further_prompt":
      return {
        ...intent,
        emit: [intent.emit[0] || [], [action.goodbyeOrFurtherPrompt]],
      };
    default:
      return intent;
  }
}

function updateIntent({ agentName, intentName, ...intent }) {
  return client(`intents/${agentName}/${intentName}`, {
    method: "PUT",
    body: intent,
  });
}

async function updateIntentName({
  agentName,
  intentName,
  intent,
  confirmIntent,
  rejectIntent,
}) {
  await client(`intents/${agentName}/${intentName}`, {
    method: "PUT",
    body: intent,
  });
  await client(`intents/${agentName}/${intentName}_confirm`, {
    method: "PUT",
    body: { ...initialConfirmIntent, ...confirmIntent },
  });
  await client(`intents/${agentName}/${intentName}_reject`, {
    method: "PUT",
    body: { ...initialRejectIntent, ...rejectIntent },
  });
}

function useIntent({ agentName, intentName }) {
  const KEY = ["intent", agentName, intentName];
  const { data: intent, status, error } = useGetIntent({
    agentName,
    intentName,
  });

  const [editIntent] = useMutation(updateIntent, {
    onMutate: ({ agentName, ...newIntent }) => {
      queryCache.cancelQueries(KEY); // stop any pending queries for intent
      const oldIntent = queryCache.getQueryData(KEY); // grab copy of old intent
      queryCache.setQueryData(KEY, newIntent); // optimistically update cache immediately

      // this is the `rollback` fn provided to onError
      // we should probably tell the user what happened with a Notify
      return () => queryCache.setQueryData(KEY, oldIntent);
    },
    onError: (err, data, rollback) => rollback(),
    onSettled: () => queryCache.invalidateQueries(KEY),
    onSuccess: () => invalidateAgentsIfFirstChange(agentName),
  });

  const dispatch = (action) => {
    // This fixes an issue introduced by optomistic updates where multiple
    //  actions dispatched by the same component interaction get reverted/lost
    // For example highlighting a new phrase to create a slot, the resultant intent
    // loses the highlighting as the two mutations are based on the initial intent state
    //  rather than accumulating. This still feels wrong but does fix that problem.
    let currentIntent = queryCache.getQueryData(KEY) || intent;
    const newIntent = getNewIntent(currentIntent, action);
    return editIntent({ agentName, intentName, ...newIntent });
  };
  return { dispatch, status, intent, error };
}

function invalidateAgentsIfFirstChange(agentName) {
  const allAgents = queryCache.getQueryData("agents");

  const currentAgent = allAgents?.find((agent) => agent.name === agentName);

  //if unpublished is false, invalidate agents and refetch, since unpublished will change to true
  //else, if unpublished is true, that means any further changes will keep this value as true, and its unneccessary to invalidate/refetch agents.
  if (!currentAgent?.unpublished) {
    queryCache.invalidateQueries("agents", {
      refetchInactive: true,
      exact: true,
    });
  }
}

export {
  updateIntentName,
  createIntent,
  useCreateIntent,
  createGreeting,
  updateIntent,
  useIntent,
  invalidateAgentsIfFirstChange,
};
