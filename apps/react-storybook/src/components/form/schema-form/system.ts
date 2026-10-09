/**
 * Deployment settings from Kelvin app schema 5.0.0, defaults.system:
 * https://apps.kelvininc.com/schemas/kelvin/5.0.0/app/app.json
 *
 * Adaptations for the form: regex formats become patterns; port, volume and
 * probe types select their fields through dependencies with oneOf; unnamed
 * fields get titles; environment variables require both name and value.
 */
import type { RJSFSchema, UiSchema } from "@rjsf/utils";

const PORT: RJSFSchema = { type: "integer", minimum: 1, maximum: 65535 };
const CPU_PATTERN = "^([0-9]+m|[0-9]+(\\.[0-9]+)?|[0-9]+)$";
const MEMORY_PATTERN =
	"^([0-9]+(\\.[0-9]+)?(Ei|Pi|Ti|Gi|Mi|Ki|E|P|T|G|M|K)?|[0-9]+)$";
const PROTOCOL: RJSFSchema = {
	type: "string",
	title: "Protocol",
	description: "Network protocol for the port.",
	enum: ["tcp", "udp"],
	default: "tcp"
};
const PROBE_SECONDS = { minimum: 1, maximum: 2147483647 };

export const SYSTEM_SCHEMA: RJSFSchema = {
	type: "object",
	title: "System",
	description:
		"System configuration for container deployment including health checks, resources, and runtime settings.",
	properties: {
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
		resources: {
			type: "object",
			title: "Resource Configuration",
			properties: {
				requests: {
					type: "object",
					title: "Resource Requests",
					properties: {
						cpu: {
							type: "string",
							title: "CPU Request",
							description: "Minimum CPU required.",
							pattern: CPU_PATTERN
						},
						memory: {
							type: "string",
							title: "Memory Request",
							description: "Minimum memory required.",
							pattern: MEMORY_PATTERN
						}
					}
				},
				limits: {
					type: "object",
					title: "Resource Limits",
					properties: {
						cpu: {
							type: "string",
							title: "CPU Limit",
							description: "Maximum CPU allowed.",
							pattern: CPU_PATTERN
						},
						memory: {
							type: "string",
							title: "Memory Limit",
							description: "Maximum memory allowed.",
							pattern: MEMORY_PATTERN
						}
					}
				}
			}
		},
		ports: {
			type: "array",
			title: "Container Ports",
			description: "List of ports exposed by the container.",
			items: {
				type: "object",
				required: ["name", "type"],
				properties: {
					name: {
						type: "string",
						title: "Port Name",
						description: "Name identifier for the port.",
						pattern: "^[a-z0-9]([-_.a-z0-9]*[a-z0-9])?$"
					},
					type: {
						type: "string",
						title: "Port Type",
						description: "Type of port to expose.",
						oneOf: [
							{ title: "Host Port", const: "host" },
							{ title: "Service Port", const: "service" }
						]
					}
				},
				dependencies: {
					type: {
						oneOf: [
							{
								properties: {
									type: { const: "host" },
									host: {
										type: "object",
										title: "Host Configuration",
										required: ["port"],
										properties: {
											port: {
												...PORT,
												title: "Host Port",
												description:
													"Port on the host machine."
											},
											protocol: PROTOCOL
										}
									}
								},
								required: ["host"]
							},
							{
								properties: {
									type: { const: "service" },
									service: {
										type: "object",
										title: "Service Configuration",
										required: ["port"],
										properties: {
											port: {
												...PORT,
												title: "Service Port",
												description:
													"Port exposed by the service."
											},
											container_port: {
												...PORT,
												title: "Container Port",
												description:
													"Port exposed by the container."
											},
											exposed: {
												type: "boolean",
												title: "Exposed",
												description:
													"Expose the port outside the cluster.",
												default: false
											},
											exposed_port: {
												type: "integer",
												title: "Exposed Port",
												description:
													"Port exposed outside the cluster.",
												minimum: 30001,
												maximum: 32767
											},
											protocol: PROTOCOL
										}
									}
								},
								required: ["service"]
							}
						]
					}
				}
			}
		},
		volumes: {
			type: "array",
			title: "Volumes",
			description: "List of volumes mounted by the container.",
			items: {
				type: "object",
				required: ["name", "target", "type"],
				properties: {
					name: {
						type: "string",
						title: "Volume Name",
						description: "Name identifier for the volume.",
						pattern: "^[a-z]([-a-z0-9]*[a-z0-9])?$"
					},
					target: {
						type: "string",
						title: "Mount Path",
						description: "Path where the volume is mounted."
					},
					type: {
						type: "string",
						title: "Volume Type",
						description: "Type of volume to use.",
						oneOf: [
							{ title: "Persistent Volume", const: "persistent" },
							{ title: "Host Volume", const: "host" },
							{ title: "Text Volume", const: "text" }
						]
					}
				},
				dependencies: {
					type: {
						oneOf: [
							{ properties: { type: { const: "persistent" } } },
							{
								properties: {
									type: { const: "host" },
									host: {
										type: "object",
										title: "Host Volume",
										required: ["source"],
										properties: {
											source: {
												type: "string",
												title: "Source Path",
												description:
													"Path on the host machine."
											}
										}
									}
								},
								required: ["host"]
							},
							{
								properties: {
									type: { const: "text" },
									text: {
										type: "object",
										title: "Text Volume",
										required: ["data"],
										properties: {
											data: {
												type: "string",
												title: "Data",
												description:
													"Text content of the volume."
											},
											base64: {
												type: "boolean",
												title: "Base64 Encoded",
												description:
													"Data is base64 encoded.",
												default: false
											},
											encoding: {
												type: "string",
												title: "Encoding",
												description:
													"Text encoding format.",
												enum: [
													"utf-8",
													"ascii",
													"latin_1"
												]
											}
										}
									}
								},
								required: ["text"]
							}
						]
					}
				}
			}
		},
		metrics: {
			type: "object",
			title: "Metrics",
			description:
				"Prometheus metrics endpoint exposed by the app and scraped by the platform.",
			required: ["port"],
			properties: {
				port: {
					...PORT,
					title: "Port",
					description: "Port serving the Prometheus metrics endpoint."
				},
				path: {
					type: "string",
					title: "Path",
					description:
						"HTTP path of the metrics endpoint. Must be absolute.",
					default: "/metrics",
					pattern: "^/.*$"
				}
			}
		},
		health_check: {
			type: "object",
			title: "Health Check",
			properties: {
				liveness_probe: {
					type: "object",
					title: "Liveness Probe",
					description:
						"Checks if the container is running. Failing the probe restarts the container.",
					properties: {
						type: {
							type: "string",
							title: "Probe Type",
							description: "Method to perform the health check.",
							oneOf: [
								{
									title: "HTTP request returns a successful status (200-399)",
									const: "http_get"
								},
								{
									title: "TCP connection opens successfully",
									const: "tcp_socket"
								},
								{
									title: "Command run inside the container exits with status 0",
									const: "exec"
								}
							]
						},
						initial_delay_seconds: {
							type: "integer",
							title: "Initial Delay (s)",
							description:
								"Seconds to wait before starting probes.",
							default: 1,
							minimum: 0,
							maximum: 2147483647
						},
						period_seconds: {
							type: "integer",
							title: "Probe Interval (s)",
							description: "Frequency of probe execution.",
							default: 10,
							...PROBE_SECONDS
						},
						timeout_seconds: {
							type: "integer",
							title: "Timeout (s)",
							description: "Seconds before the probe times out.",
							default: 1,
							...PROBE_SECONDS
						},
						failure_threshold: {
							type: "integer",
							title: "Failure Threshold",
							description:
								"Failures before restarting the container.",
							default: 3,
							...PROBE_SECONDS
						}
					},
					dependencies: {
						type: {
							oneOf: [
								{
									properties: {
										type: { const: "http_get" },
										http_get: {
											type: "object",
											title: "HTTP GET Probe",
											description:
												"Performs an HTTP GET request to check health.",
											required: ["port"],
											properties: {
												scheme: {
													type: "string",
													title: "Scheme",
													description:
														"Protocol to use.",
													enum: ["http", "https"]
												},
												path: {
													type: "string",
													title: "Path",
													description:
														"HTTP path to access."
												},
												port: {
													...PORT,
													title: "Port",
													description:
														"Port for the HTTP server."
												},
												http_headers: {
													type: "array",
													title: "HTTP Headers",
													description:
														"Custom headers for the request.",
													items: {
														type: "object",
														properties: {
															name: {
																type: "string",
																title: "Header Name",
																pattern:
																	"^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$"
															},
															value: {
																type: "string",
																title: "Header Value",
																pattern:
																	"^[\\x20-\\x7E]*$"
															}
														}
													}
												}
											}
										}
									},
									required: ["http_get"]
								},
								{
									properties: {
										type: { const: "tcp_socket" },
										tcp_socket: {
											type: "object",
											title: "TCP Socket Probe",
											description:
												"Checks if a TCP port is open.",
											required: ["port"],
											properties: {
												port: {
													...PORT,
													title: "Port",
													description:
														"TCP port to check."
												}
											}
										}
									},
									required: ["tcp_socket"]
								},
								{
									properties: {
										type: { const: "exec" },
										exec: {
											type: "object",
											title: "Exec Probe",
											description:
												"Runs a command inside the container to check health.",
											required: ["command"],
											properties: {
												command: {
													type: "array",
													title: "Command",
													description:
														"Command to execute. Exit code 0 is healthy.",
													items: {
														type: "string",
														title: "Argument"
													}
												}
											}
										}
									},
									required: ["exec"]
								}
							]
						}
					}
				}
			}
		},
		privileged: {
			type: "boolean",
			title: "Privileged",
			description: "Run the container in privileged mode.",
			default: false
		}
	}
};

export const SYSTEM_UI_SCHEMA: UiSchema = {
	"ui:submitButtonOptions": { norender: true },
	// Core UI's tab order: variables, resources, ports, volumes, then the advanced settings
	"ui:order": [
		"environment_vars",
		"resources",
		"ports",
		"volumes",
		"metrics",
		"health_check",
		"privileged"
	],
	environment_vars: {
		"ui:itemPrefix": "Variable",
		// Matches the table mockup, which has no grip; D11 decides whether variables stay orderable
		"ui:options": { orderable: false }
	},
	resources: {
		"ui:order": ["requests", "limits"],
		requests: {
			cpu: {
				"ui:description":
					'Minimum CPU required. A decimal number, or a whole number with the "m" suffix (e.g., 0.5, 500m).'
			},
			memory: {
				"ui:description":
					"Minimum memory required. A number with an optional unit suffix (e.g., 512Mi, 2Gi)."
			}
		},
		limits: {
			cpu: {
				"ui:description":
					'Maximum CPU allowed. A decimal number, or a whole number with the "m" suffix (e.g., 0.5, 500m).'
			},
			memory: {
				"ui:description":
					"Maximum memory allowed. A number with an optional unit suffix (e.g., 512Mi, 2Gi)."
			}
		}
	},
	ports: { "ui:itemPrefix": "Port" },
	volumes: { "ui:itemPrefix": "Volume" },
	health_check: {
		liveness_probe: {
			"ui:order": [
				"type",
				"http_get",
				"tcp_socket",
				"exec",
				"initial_delay_seconds",
				"period_seconds",
				"timeout_seconds",
				"failure_threshold"
			],
			http_get: {
				"ui:order": ["scheme", "path", "port", "http_headers"],
				http_headers: { "ui:itemPrefix": "Header" }
			},
			// The command's items are argv, so their order matters and stays editable
			exec: { command: { "ui:itemPrefix": "Argument" } }
		}
	}
};

/**
 * Starts with one invalid value of each kind the section can hold:
 * - an environment variable with a name that starts with a digit and no value (the table mockup's row);
 * - a service port exposed below the 30001-32767 range;
 * - a text volume without its data;
 * - metrics with no port and a relative path.
 * Everything else is valid, including a port name with an underscore (`metrics_1`), which the app
 * schema allows and Core UI's own pattern rejects.
 */
export const SYSTEM_FORM_DATA = {
	environment_vars: [
		{ name: "LOG_LEVEL", value: "info" },
		{ name: "1_BROKER_URL" }
	],
	resources: {
		requests: { cpu: "250m", memory: "256Mi" },
		limits: { cpu: "1", memory: "1Gi" }
	},
	ports: [
		{ name: "opcua", type: "host", host: { port: 4840, protocol: "tcp" } },
		{
			name: "metrics_1",
			type: "service",
			service: {
				port: 9090,
				container_port: 9090,
				exposed: true,
				exposed_port: 8080,
				protocol: "tcp"
			}
		}
	],
	volumes: [
		{ name: "data", target: "/data", type: "persistent" },
		{
			name: "certs",
			target: "/certs",
			type: "text",
			text: { encoding: "utf-8" }
		}
	],
	metrics: { path: "metrics" },
	health_check: {
		liveness_probe: {
			type: "http_get",
			http_get: {
				scheme: "http",
				path: "/healthz",
				port: 8080,
				http_headers: [{ name: "X-Probe", value: "kelvin" }]
			},
			initial_delay_seconds: 5,
			period_seconds: 10,
			timeout_seconds: 1,
			failure_threshold: 3
		}
	},
	privileged: false
};
