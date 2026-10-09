import type { RJSFSchema, UiSchema } from "@rjsf/utils";

export const inlineSchema: RJSFSchema = {
	type: "object",
	properties: {
		shift_info: {
			title: "Shift info",
			type: "object",
			properties: {
				name: {
					title: "Shift name",
					type: "string"
				},
				start_at: {
					title: "Starts at",
					type: "string",
					format: "date-time"
				},
				end_at: {
					title: "Ends at",
					type: "string",
					format: "date-time",
					formatExclusiveMinimum: { $data: "1/start_at" }
				}
			},
			required: ["name", "start_at", "end_at"]
		},
		production_info: {
			title: "Production info",
			type: "object",
			properties: {
				sku: {
					title: "SKU",
					type: "string"
				},
				expected_start_at: {
					title: "Expected to start at",
					type: "string",
					format: "date-time"
				},
				expected_end_at: {
					title: "Expected to end at",
					type: "string",
					format: "date-time",
					formatExclusiveMinimum: { $data: "1/expected_start_at" }
				}
			},
			required: ["sku", "expected_start_at", "expected_end_at"]
		},
		team_info: {
			title: "Team info",
			type: "array",
			items: {
				type: "object",
				properties: {
					name: {
						title: "Name",
						type: "string"
					},
					email: {
						title: "Email",
						type: "string",
						format: "email"
					},
					phone_country_code: {
						title: "Phone country code",
						type: "string"
					},
					phone_number: {
						title: "Phone number",
						type: "number"
					},
					role: {
						title: "Role",
						type: "string"
					},
					responsible_for: {
						title: "Asset responsible for",
						type: "string",
						oneOf: [
							{
								title: "Asset 3",
								const: "asset-name-3"
							},
							{
								title: "Asset 2",
								const: "asset-name-2"
							},
							{
								title: "Asset 1",
								const: "asset-name-1"
							}
						]
					}
				},
				required: [
					"name",
					"email",
					"phone_country_code",
					"phone_number",
					"role",
					"responsible_for"
				]
			}
		},
		assets_oee: {
			type: "array",
			items: {
				type: "object",
				properties: {
					asset_name: {
						type: "string",
						oneOf: [
							{
								title: "Asset 3",
								const: "asset-name-3"
							},
							{
								title: "Asset 2",
								const: "asset-name-2"
							},
							{
								title: "Asset 1",
								const: "asset-name-1"
							}
						]
					},
					oee_thresholds: {
						title: "OEE - Thresholds",
						type: "object",
						properties: {
							target: {
								title: "OEE Target",
								type: "number",
								exclusiveMinimum: 0
							},
							critical_alarm: {
								title: "OEE Critical",
								type: "number",
								exclusiveMinimum: 0
							},
							warning_alarm: {
								title: "OEE Urgent",
								type: "number",
								exclusiveMinimum: 0
							}
						},
						required: ["target", "critical_alarm", "warning_alarm"]
					},
					oee_calculation: {
						title: "OEE - Calculation",
						type: "object",
						properties: {
							ideal_cycle_time: {
								title: "Ideal cycle time",
								type: "number",
								exclusiveMinimum: 0
							},
							total_units: {
								title: "Total units",
								type: "number",
								exclusiveMinimum: 0
							},
							good_units: {
								title: "Good units",
								type: "number",
								exclusiveMinimum: 0,
								maximum: {
									$data: "1/total_units"
								} as unknown as number
							},
							run_time: {
								title: "Run time",
								type: "number",
								exclusiveMinimum: 0,
								maximum: {
									$data: "1/planned_production_time"
								} as unknown as number // The validator enables sibling-value $data references.
							},
							planned_production_time: {
								title: "Planned production time",
								type: "number",
								minimum: 0
							}
						},
						required: [
							"ideal_cycle_time",
							"total_units",
							"good_units",
							"run_time",
							"planned_production_time"
						]
					}
				}
			}
		}
	}
};

export const inlineUiSchema: UiSchema = {
	"ui:inputConfig": {
		width: "fit-content",
		minWidth: "132px",
		maxWidth: "unset"
	},
	shift_info: {
		"ui:inline": true,
		"ui:inputWidth": "fit-content"
	},
	production_info: {
		"ui:inline": true,
		"ui:inputWidth": "200px"
	},
	team_info: {
		"ui:itemPrefix": "Collaborator",
		"ui:options": {
			addable: true,
			orderable: false,
			removable: true
		},
		items: {
			"ui:title": "",
			"ui:itemPrefix": "Collaborator",
			"ui:inline": true,
			"ui:inputWidth": "fit-content",
			responsible_for: {
				searchable: true,
				"ui:placeholder": ""
			}
		}
	},
	assets_oee: {
		"ui:title": "",
		"ui:options": {
			addable: false,
			orderable: false,
			removable: false
		},
		"ui:inputWidth": "fit-content",
		items: {
			"ui:title": "",
			"ui:fieldset": true,
			asset_name: {
				"ui:widget": "readOnlyValue",
				"ui:readonly": true,
				"ui:options": {
					label: false
				}
			},
			oee_thresholds: {
				"ui:inline": true,
				"ui:inputWidth": "fit-content"
			},
			oee_calculation: {
				"ui:inline": true,
				"ui:inputWidth": "400px"
			}
		}
	}
};

const OPC_TCP_URL_PATTERN = "^opc\\.tcp://[a-zA-Z0-9.-]+(:[0-9]{1,5})?(/.*)?$";

/**
 * Connector settings from OPC UA, MQTT and Kafka examples, combined to show
 * nested sections, validation and conditional fields:
 * - OPC UA: pattern errors, file inputs, boolean radios, `oneOf` selects, and
 *   options picked through `dependencies` + `not`, which fail on the section itself
 * - MQTT: integer ranges and secret-template defaults
 * - Kafka: a root description, `oneOf` object options with a hidden discriminator,
 *   textareas, passwords, enums, sections nested four levels deep, an array of
 *   objects whose items hold their own section, and min-value errors
 * - Core UI's workload System tab: environment variables in a flat-object table
 */
export const CONFIGURATION_SCHEMA: RJSFSchema = {
	type: "object",
	description: "Broker connection, security, and producer settings.",
	properties: {
		connection: {
			type: "object",
			title: "Connection",
			properties: {
				endpoint_url: {
					type: "string",
					title: "Endpoint URL",
					description: "e.g., opc.tcp://localhost:48010",
					pattern: OPC_TCP_URL_PATTERN
				},
				discovery_url: {
					type: "string",
					title: "Discovery URL (Alternative)",
					description: "e.g., opc.tcp://localhost:48010/discovery",
					pattern: OPC_TCP_URL_PATTERN
				},
				port: {
					type: "integer",
					title: "Port",
					description: "Keep it in sync with the service port.",
					minimum: 1,
					maximum: 65535
				},
				skip_discovery: {
					type: "boolean",
					title: "Skip discovery",
					default: false
				},
				verify_ssl: {
					type: "boolean",
					title: "Verify SSL",
					default: false
				},
				security_policy: {
					type: "string",
					title: "Security Policy",
					default: "none",
					oneOf: [
						{ const: "none", title: "None" },
						{ const: "Basic256", title: "Basic256" },
						{ const: "Basic256Sha256", title: "Basic256Sha256" }
					]
				},
				client_cert: {
					type: "string",
					format: "data-url",
					title: "Client Certificate",
					description:
						"Client certificate for secure connections. If not set, application will generate a new one each time."
				}
			},
			required: ["endpoint_url", "security_policy"],
			dependencies: {
				verify_ssl: {
					oneOf: [
						{
							type: "object",
							properties: {
								verify_ssl: { const: true },
								server_cert: {
									type: "string",
									format: "data-url",
									title: "Server Certificate"
								}
							},
							required: ["server_cert"]
						},
						{
							type: "object",
							properties: {
								verify_ssl: { not: { enum: [true] } }
							}
						}
					]
				}
			}
		},
		authentication: {
			type: "object",
			title: "Server Authentication",
			properties: {
				type: {
					type: "string",
					title: "Authentication Method",
					default: "none",
					oneOf: [
						{ const: "none", title: "None" },
						{ const: "credentials", title: "Credentials" },
						{ const: "certificate", title: "Certificate" }
					]
				}
			},
			required: ["type"],
			dependencies: {
				type: {
					oneOf: [
						{
							type: "object",
							properties: {
								type: { const: "credentials" },
								credentials: {
									type: "object",
									title: "Credentials",
									properties: {
										username: {
											type: "string",
											title: "Username"
										},
										password: {
											type: "string",
											title: "Password"
										}
									},
									required: ["username", "password"]
								}
							},
							required: ["credentials"]
						},
						{
							type: "object",
							properties: {
								type: { const: "certificate" },
								certificate: {
									type: "object",
									title: "Certificates",
									properties: {
										user_cert: {
											type: "string",
											format: "data-url",
											title: "User Certificate"
										},
										key_password: {
											type: "string",
											title: "Key Password"
										}
									},
									required: ["user_cert", "key_password"]
								}
							},
							required: ["certificate"]
						},
						{
							type: "object",
							properties: {
								type: {
									not: {
										enum: ["credentials", "certificate"]
									}
								}
							}
						}
					]
				}
			}
		},
		kafka: {
			type: "object",
			title: "Kafka",
			description: "Broker connection and security.",
			properties: {
				bootstrap_servers: {
					type: "string",
					title: "Bootstrap Servers",
					description: "Comma-separated host:port list.",
					default: "kafka.example.com:9092",
					minLength: 1
				},
				security: {
					type: "object",
					title: "Security",
					description:
						"Protocol and credentials for the broker connection.",
					oneOf: [
						{
							title: "Plaintext",
							properties: {
								protocol: {
									type: "string",
									title: "Protocol",
									const: "PLAINTEXT",
									default: "PLAINTEXT"
								}
							},
							required: ["protocol"]
						},
						{
							title: "SASL over TLS",
							properties: {
								protocol: {
									type: "string",
									title: "Protocol",
									const: "SASL_SSL",
									default: "SASL_SSL"
								},
								sasl: {
									type: "object",
									title: "SASL Authentication",
									description:
										"Required with a SASL_* protocol: set all three together.",
									properties: {
										mechanism: {
											type: "string",
											title: "Mechanism",
											description:
												"Set with username and password.",
											enum: [
												"PLAIN",
												"SCRAM-SHA-256",
												"SCRAM-SHA-512"
											]
										},
										username: {
											type: "string",
											title: "Username",
											description:
												"SASL username. Wire to a secret.",
											default: "<% secrets.kafka-user %>"
										},
										password: {
											type: "string",
											title: "Password",
											description:
												"SASL password. Wire to a secret.",
											default:
												"<% secrets.kafka-password %>"
										}
									},
									required: [
										"mechanism",
										"username",
										"password"
									]
								},
								tls: {
									type: "object",
									title: "TLS",
									description:
										"PEM content, wired to secrets on deployment.",
									properties: {
										ca_cert: {
											type: "string",
											title: "CA Certificate",
											description:
												"Optional: private CA bundle; empty uses the system CAs."
										},
										mtls: {
											type: "object",
											title: "Mutual TLS",
											description:
												"Provide both the client certificate and key for Mutual TLS.",
											properties: {
												client_cert: {
													type: "string",
													title: "Client Certificate",
													description:
														"PEM certificate presented to the broker."
												},
												client_key: {
													type: "string",
													title: "Client Key",
													description:
														"PEM client key. Wire to a secret."
												}
											},
											required: [
												"client_cert",
												"client_key"
											]
										}
									}
								}
							},
							required: ["protocol", "sasl"]
						}
					]
				},
				topics: {
					type: "array",
					title: "Topics",
					description:
						"One entry per topic the exporter produces to.",
					items: {
						type: "object",
						title: "Topic",
						properties: {
							name: {
								type: "string",
								title: "Name",
								minLength: 1
							},
							partitions: {
								type: "integer",
								title: "Partitions",
								default: 1,
								minimum: 1
							},
							retention: {
								type: "object",
								title: "Retention",
								description:
									"How long the broker keeps messages.",
								properties: {
									hours: {
										type: "integer",
										title: "Hours",
										default: 168,
										minimum: 1
									},
									cleanup_policy: {
										type: "string",
										title: "Cleanup Policy",
										default: "delete",
										enum: ["delete", "compact"]
									}
								}
							}
						},
						required: ["name"]
					}
				}
			},
			required: ["bootstrap_servers"]
		},
		upload: {
			type: "object",
			title: "Upload",
			description: "Batching and retry for the drain loop.",
			properties: {
				interval: {
					type: "integer",
					title: "Interval (s)",
					description: "Seconds between drain runs.",
					default: 60,
					minimum: 1
				},
				retry: {
					type: "object",
					title: "Retry",
					description: "Exponential backoff for a failed batch.",
					properties: {
						attempts: {
							type: "integer",
							title: "Attempts",
							description:
								"Attempts before a batch is abandoned.",
							default: 3,
							minimum: 1
						},
						max_delay: {
							type: "number",
							title: "Max Delay (s)",
							description: "Ceiling on the backoff delay.",
							default: 30,
							minimum: 0
						}
					}
				}
			}
		},
		environment_vars: {
			type: "array",
			title: "Environment Variables",
			description: "List of environment variables.",
			items: {
				type: "object",
				required: ["name", "value"],
				properties: {
					name: {
						type: "string",
						title: "Variable Name",
						description: "Name of the environment variable.",
						pattern: "^[A-Za-z_][A-Za-z0-9_]*$"
					},
					value: {
						type: "string",
						title: "Variable Value",
						description: "Value of the environment variable."
					}
				}
			}
		},
		session_name: {
			type: "string",
			title: "Session Name",
			minLength: 3
		},
		force_read_after_write: {
			type: "boolean",
			title: "Force Read After Write",
			default: false
		},
		logging_level: {
			type: "string",
			title: "Logging Level",
			oneOf: [
				{ const: "INFO", title: "Info" },
				{ const: "DEBUG", title: "Debug" },
				{ const: "WARNING", title: "Warning" },
				{ const: "ERROR", title: "Error" }
			]
		}
	},
	required: ["connection", "authentication", "kafka"]
};

export const CONFIGURATION_UI_SCHEMA: UiSchema = {
	"ui:submitButtonOptions": { norender: true },
	"ui:order": [
		"connection",
		"authentication",
		"kafka",
		"upload",
		"environment_vars",
		"session_name",
		"force_read_after_write",
		"logging_level"
	],
	connection: {
		"ui:order": [
			"endpoint_url",
			"discovery_url",
			"port",
			"skip_discovery",
			"verify_ssl",
			"server_cert",
			"security_policy",
			"client_cert"
		],
		server_cert: { "ui:accept": ".der" },
		client_cert: { "ui:accept": ".der" }
	},
	authentication: {
		credentials: {
			"ui:order": ["username", "password"],
			password: { "ui:widget": "password" }
		},
		certificate: {
			user_cert: { "ui:accept": ".der" },
			key_password: { "ui:widget": "password" }
		}
	},
	environment_vars: {
		"ui:itemPrefix": "Variable",
		items: {
			"ui:order": ["name", "value"],
			name: {
				"ui:description":
					"Name of the environment variable. Must start with a letter or underscore, followed by letters, numbers, or underscores. (e.g., MY_ENV_VAR)."
			},
			value: {
				"ui:description": "Value of the environment variable."
			}
		}
	},
	kafka: {
		security: {
			protocol: { "ui:widget": "hidden" },
			sasl: {
				"ui:order": ["mechanism", "username", "password"],
				password: { "ui:widget": "password" }
			},
			tls: {
				ca_cert: { "ui:widget": "textarea" },
				mtls: {
					client_cert: { "ui:widget": "textarea" },
					client_key: { "ui:widget": "password" }
				}
			}
		}
	}
};

/**
 * An app's parameters (from the jg-parameters test app, with ranges added): a
 * flat form with no sections, as the App Settings parameters step renders it.
 */
export const PARAMETERS_SCHEMA: RJSFSchema = {
	type: "object",
	properties: {
		param_number: {
			type: "number",
			title: "Parameter Number",
			default: 100,
			minimum: 0,
			maximum: 1000
		},
		param_integer: {
			type: "integer",
			title: "Parameter Integer",
			default: 5,
			minimum: 1
		},
		param_string: {
			type: "string",
			title: "Parameter String",
			default: "App default",
			minLength: 1
		},
		param_boolean: {
			type: "boolean",
			title: "Parameter Boolean",
			default: true
		},
		param_enum: {
			type: "string",
			title: "Parameter Enum",
			default: "option1",
			enum: ["option1", "option2", "option3"]
		}
	},
	required: ["param_number", "param_string"]
};
