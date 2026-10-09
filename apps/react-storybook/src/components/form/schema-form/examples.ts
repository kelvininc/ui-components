import type { RJSFSchema } from "@rjsf/utils";
import { CONFIGURATION_SCHEMA } from "./config";
import { SYSTEM_SCHEMA } from "./system";

export const TOPICS_SCHEMA: RJSFSchema = {
	type: "array",
	title: "Topics",
	description: "Topics received from the plant broker.",
	minItems: 1,
	maxItems: 5,
	items: { type: "string", title: "Topic", minLength: 1 }
};

export const TOPICS_FORM_DATA = [
	"line-1.telemetry",
	"line-1.alarms",
	"line-1.commands"
];

export const TOPIC_OBJECTS_SCHEMA = (
	CONFIGURATION_SCHEMA.properties!.kafka as RJSFSchema
).properties!.topics as RJSFSchema;

export const TOPIC_OBJECTS_FORM_DATA = TOPICS_FORM_DATA.map((name) => ({
	name,
	partitions: 3,
	retention: { hours: 168, cleanup_policy: "delete" }
}));

export const VARIABLES_SCHEMA = SYSTEM_SCHEMA.properties!
	.environment_vars as RJSFSchema;

export const VARIABLES_FORM_DATA = [
	{ name: "LOG_LEVEL", value: "info" },
	{ name: "1_BROKER_URL" },
	{ name: "SHIFT_ID", value: "production-day" }
];

export const FALSE_AND_ZERO_SCHEMA: RJSFSchema = {
	type: "object",
	properties: {
		enabled: { type: "boolean", title: "Connect to broker" },
		retries: {
			type: "integer",
			title: "Retry policy",
			oneOf: [
				{ const: 0, title: "No retries" },
				{ const: 1, title: "Retry once" },
				{ const: 3, title: "Retry three times" }
			]
		},
		region: {
			type: ["string", "null"],
			title: "Deployment region",
			enum: [null, "lisbon", "berlin"]
		}
	},
	required: ["region"]
};

export const FILE_PREVIEW_SCHEMA: RJSFSchema = {
	type: "object",
	properties: {
		certificate: {
			type: "string",
			format: "data-url",
			title: "Uploaded certificate"
		},
		secret: {
			type: "string",
			format: "data-url",
			title: "Certificate secret reference"
		},
		attachments: {
			type: "array",
			title: "Diagnostic files",
			maxItems: 3,
			items: { type: "string", format: "data-url" }
		}
	}
};

export const FILE_PREVIEW_FORM_DATA = {
	certificate: "data:text/plain;name=ca.pem;base64,a2VsdmluCg==",
	secret: "<% secrets.ca %>",
	attachments: [
		"data:text/plain;name=connection.log;base64,Q29ubmVjdGVkCg==",
		"<% secrets.diagnostics %>"
	]
};
