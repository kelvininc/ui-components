import type { RJSFSchema, UiSchema } from "@rjsf/utils";
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

export const NESTED_HIERARCHY_EXAMPLE = {
	schema: {
		type: "array",
		title: "Broker connectors",
		description: "Connection and security settings for the plant broker.",
		items: {
			type: "object",
			properties: {
				name: {
					type: "string",
					title: "Connector name",
					description: "Identifies this connector in the workload."
				},
				connection: {
					type: "object",
					title: "Connection",
					properties: {
						broker: {
							type: "string",
							title: "Broker address",
							description:
								"Hostname and port of the Kafka broker."
						},
						security: {
							type: "object",
							title: "Security",
							properties: {
								protocol: {
									type: "string",
									title: "Security protocol",
									enum: ["TLS", "Plaintext"],
									default: "TLS"
								}
							},
							dependencies: {
								protocol: {
									oneOf: [
										{
											properties: {
												protocol: {
													const: "TLS"
												},
												tls: {
													type: "object",
													title: "TLS settings",
													properties: {
														server_name: {
															type: "string",
															title: "Server name",
															description:
																"Hostname expected in the server certificate.",
															format: "hostname",
															default:
																"kafka-line-1.internal"
														},
														client_identities: {
															type: "array",
															title: "Client identities",
															description:
																"Certificate sets available for mutual TLS.",
															minItems: 1,
															items: {
																type: "object",
																title: "Client identity",
																properties: {
																	name: {
																		type: "string",
																		title: "Identity name",
																		description:
																			"Identifies this client certificate set."
																	},
																	certificate:
																		{
																			type: "string",
																			format: "data-url",
																			title: "Client certificate"
																		},
																	private_key:
																		{
																			type: "string",
																			format: "data-url",
																			title: "Client private key"
																		}
																},
																required: [
																	"name",
																	"certificate",
																	"private_key"
																]
															}
														}
													},
													required: [
														"server_name",
														"client_identities"
													]
												}
											},
											required: ["tls"]
										},
										{
											properties: {
												protocol: {
													const: "Plaintext"
												}
											}
										}
									]
								}
							},
							required: ["protocol"]
						}
					},
					required: ["broker", "security"]
				}
			},
			required: ["name", "connection"]
		}
	} as RJSFSchema,
	uiSchema: {
		"ui:itemPrefix": "Connector",
		"ui:submitButtonOptions": {
			norender: true
		},
		items: {
			connection: {
				security: {
					tls: {
						client_identities: {
							"ui:itemPrefix": "Identity",
							"ui:options": {
								layout: "sections"
							}
						}
					}
				}
			}
		}
	} as UiSchema,
	formData: [
		{
			name: "line-1-exporter",
			connection: {
				broker: "kafka-line-1.internal:9093",
				security: {
					protocol: "TLS",
					tls: {
						server_name: "kafka_line_1",
						client_identities: [
							{
								name: "primary-client",
								certificate: "<% secrets.primary_cert %>",
								private_key: "<% secrets.primary_key %>"
							},
							{
								name: "standby-client",
								certificate: "<% secrets.standby_cert %>",
								private_key: "<% secrets.standby_key %>"
							}
						]
					}
				}
			}
		}
	]
};

const hierarchyTls = (NESTED_HIERARCHY_EXAMPLE.schema.items as RJSFSchema)
	.properties!.connection as RJSFSchema;
const hierarchyTlsSchema = (
	(
		(hierarchyTls.properties!.security as RJSFSchema).dependencies!
			.protocol as RJSFSchema
	).oneOf![0] as RJSFSchema
).properties!.tls as RJSFSchema;
const hierarchyIdentityArray = hierarchyTlsSchema.properties!
	.client_identities as RJSFSchema;
const hierarchyIdentity = hierarchyIdentityArray.items as RJSFSchema;
const hierarchyProfiles: RJSFSchema = {
	type: "array",
	title: "Rotation profiles",
	minItems: 1,
	items: {
		type: "object",
		properties: {
			name: { type: "string", title: "Profile name", default: "monthly" },
			enabled: { type: "boolean", title: "Enabled" }
		}
	}
};
const hierarchyRotation: RJSFSchema = {
	type: "object",
	title: "Rotation",
	properties: { profiles: hierarchyProfiles }
};

export const DEEP_SECTION_HIERARCHY_EXAMPLE = {
	schema: {
		...NESTED_HIERARCHY_EXAMPLE.schema,
		items: {
			...(NESTED_HIERARCHY_EXAMPLE.schema.items as RJSFSchema),
			properties: {
				...(NESTED_HIERARCHY_EXAMPLE.schema.items as RJSFSchema)
					.properties,
				connection: {
					...hierarchyTls,
					properties: {
						...hierarchyTls.properties,
						security: {
							...(hierarchyTls.properties!
								.security as RJSFSchema),
							dependencies: {
								protocol: {
									oneOf: [
										{
											properties: {
												protocol: { const: "TLS" },
												tls: {
													...hierarchyTlsSchema,
													properties: {
														...hierarchyTlsSchema.properties,
														client_identities: {
															...hierarchyIdentityArray,
															items: {
																...hierarchyIdentity,
																properties: {
																	...hierarchyIdentity.properties,
																	rotation:
																		hierarchyRotation
																}
															}
														}
													}
												}
											},
											required: ["tls"]
										},
										{
											properties: {
												protocol: { const: "Plaintext" }
											}
										}
									]
								}
							}
						}
					}
				}
			}
		}
	} as RJSFSchema,
	uiSchema: {
		...NESTED_HIERARCHY_EXAMPLE.uiSchema,
		items: {
			connection: {
				security: {
					tls: {
						client_identities: {
							"ui:itemPrefix": "Identity",
							"ui:options": { layout: "sections" },
							items: {
								rotation: {
									"ui:title": "",
									profiles: {
										"ui:itemPrefix": "Profile",
										"ui:options": { layout: "sections" }
									}
								}
							}
						}
					}
				}
			}
		}
	} as UiSchema,
	formData: NESTED_HIERARCHY_EXAMPLE.formData.map((connector) => ({
		...connector,
		connection: {
			...connector.connection,
			security: {
				...connector.connection.security,
				tls: {
					...connector.connection.security.tls,
					client_identities:
						connector.connection.security.tls.client_identities.map(
							(identity: Record<string, unknown>) => ({
								...identity,
								rotation: {
									profiles: [
										{ name: "monthly", enabled: true },
										{ name: "weekly", enabled: false }
									]
								}
							})
						)
				}
			}
		}
	}))
};
