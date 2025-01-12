import type { Handler } from "@netlify/functions";
import { slackApi, verifySlackRequests } from "./util/slack";
import { parse } from "querystring";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
  switch (payload.command) {
    case "/foodfight":
      const response = await slackApi("chat.postMessage", {
        channel: payload.channel_id,
        text: "Things are happening!",
      });

      if (!response.ok) {
        console.log(response);
      }
      return {
        statusCode: 20,
        body: "",
      };
    default:
      return {
        statusCode: 200,
        body: `Command ${payload.command} not recognised`,
      };
  }
}

export const handler: Handler = async (event) => {
  // TODO validate the Slack request
  const valid = verifySlackRequests(event);

  if (!valid) {
    console.error("invalid request");
    return {
      statusCode: 400,
      body: "invalid request",
    };
  }

  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }

  // TODO handle interactivity (e.g. context commands, modals)

  return {
    statusCode: 200,
    body: "TODO: handle Slack commands and interactivity , lala",
  };
};
