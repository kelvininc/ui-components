import { afterEach, describe, expect, it, vi } from 'vitest';
import { getInitialFormData, normalizeEnums, normalizeSchema } from './schema-form';
import { RJSFSchema } from '@rjsf/utils';
import { EApplyDefaults } from '../../components/SchemaForm/types';

describe('normalizeEnums', () => {
	describe('basic cases', () => {
		it('should return unchanged schema when input is null or undefined', () => {
			expect(normalizeEnums(null as unknown as RJSFSchema)).toEqual({ schema: null, uiSchema: {} });
			expect(normalizeEnums(undefined as unknown as RJSFSchema)).toEqual({ schema: undefined, uiSchema: {} });
		});

		it('should return unchanged schema when no oneOf present', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					name: { type: 'string' },
					age: { type: 'number' }
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual(schema);
			expect(result.uiSchema).toEqual({});
		});

		it('should not transform oneOf that carries a key with nowhere to go', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: [
							{ const: 'on', title: 'On', readOnly: true },
							{ const: 'off', title: 'Off', readOnly: true }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.status).toHaveProperty('oneOf');
			expect(result.uiSchema).toEqual({});
		});

		it('should move per-option descriptions to ui:enumDescriptions', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: [
							{ const: 'on', title: 'On', description: 'Active state' },
							{ const: 'off', title: 'Off', description: 'Inactive state' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.status).toEqual({ type: 'string', enum: ['on', 'off'] });
			expect(result.uiSchema).toEqual({
				status: {
					'ui:enumNames': ['On', 'Off'],
					'ui:enumDescriptions': ['Active state', 'Inactive state']
				}
			});
		});
	});

	describe('simple property with oneOf', () => {
		it('should transform oneOf with title/const into enum and ui:enumNames', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: [
							{ const: 'on', title: 'On' },
							{ const: 'off', title: 'Off' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual({
				type: 'object',
				properties: {
					status: {
						type: 'string',
						enum: ['on', 'off']
					}
				}
			});
			expect(result.uiSchema).toEqual({
				status: {
					'ui:enumNames': ['On', 'Off']
				}
			});
		});

		it('should handle multiple properties with oneOf', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: [
							{ const: 'active', title: 'Active' },
							{ const: 'inactive', title: 'Inactive' }
						]
					},
					priority: {
						type: 'string',
						oneOf: [
							{ const: 'high', title: 'High Priority' },
							{ const: 'low', title: 'Low Priority' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.status).toEqual({
				type: 'string',
				enum: ['active', 'inactive']
			});
			expect(result.schema.properties?.priority).toEqual({
				type: 'string',
				enum: ['high', 'low']
			});
			expect(result.uiSchema).toEqual({
				status: { 'ui:enumNames': ['Active', 'Inactive'] },
				priority: { 'ui:enumNames': ['High Priority', 'Low Priority'] }
			});
		});
	});

	describe('array items with oneOf', () => {
		it('should transform oneOf inside array items', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					alarm_statuses: {
						type: 'array',
						title: 'Status',
						uniqueItems: true,
						minItems: 1,
						items: {
							type: 'string',
							oneOf: [
								{ title: 'Active', const: 'active' },
								{ title: 'Acknowledged', const: 'acknowledged' },
								{ title: 'Resolved', const: 'resolved' }
							]
						}
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual({
				type: 'object',
				properties: {
					alarm_statuses: {
						type: 'array',
						title: 'Status',
						uniqueItems: true,
						minItems: 1,
						items: {
							type: 'string',
							enum: ['active', 'acknowledged', 'resolved']
						}
					}
				}
			});
			expect(result.uiSchema).toEqual({
				alarm_statuses: {
					'ui:enumNames': ['Active', 'Acknowledged', 'Resolved']
				}
			});
		});

		it('should handle array with regular enum (no transformation needed)', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					tags: {
						type: 'array',
						items: {
							type: 'string',
							enum: ['tag1', 'tag2', 'tag3']
						}
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual(schema);
			expect(result.uiSchema).toEqual({});
		});
	});

	describe('nested properties', () => {
		it('should transform oneOf in deeply nested properties', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					settings: {
						type: 'object',
						properties: {
							display: {
								type: 'object',
								properties: {
									theme: {
										type: 'string',
										oneOf: [
											{ const: 'light', title: 'Light Theme' },
											{ const: 'dark', title: 'Dark Theme' }
										]
									}
								}
							}
						}
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.settings?.properties?.display?.properties?.theme).toEqual({
				type: 'string',
				enum: ['light', 'dark']
			});
			expect(result.uiSchema).toEqual({
				settings: {
					display: {
						theme: {
							'ui:enumNames': ['Light Theme', 'Dark Theme']
						}
					}
				}
			});
		});

		it('should handle mixed nested properties with and without oneOf', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					user: {
						type: 'object',
						properties: {
							name: { type: 'string' },
							role: {
								type: 'string',
								oneOf: [
									{ const: 'admin', title: 'Administrator' },
									{ const: 'user', title: 'Regular User' }
								]
							}
						}
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.user?.properties?.name).toEqual({ type: 'string' });
			expect(result.schema.properties?.user?.properties?.role).toEqual({
				type: 'string',
				enum: ['admin', 'user']
			});
			expect(result.uiSchema).toEqual({
				user: {
					role: {
						'ui:enumNames': ['Administrator', 'Regular User']
					}
				}
			});
		});
	});

	describe('nested arrays', () => {
		it('should handle array of objects with oneOf properties', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					items: {
						type: 'array',
						items: {
							type: 'object',
							properties: {
								status: {
									type: 'string',
									oneOf: [
										{ const: 'pending', title: 'Pending' },
										{ const: 'done', title: 'Done' }
									]
								}
							}
						}
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.items?.items?.properties?.status).toEqual({
				type: 'string',
				enum: ['pending', 'done']
			});
			expect(result.uiSchema).toEqual({
				items: {
					status: {
						'ui:enumNames': ['Pending', 'Done']
					}
				}
			});
		});
	});

	describe('edge cases', () => {
		it('should handle empty oneOf array', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: []
					}
				}
			};

			const result = normalizeEnums(schema);

			// Empty array should not match isOneOfWithTitleAndConst
			expect(result.schema.properties?.status).toHaveProperty('oneOf');
		});

		it('should handle oneOf with only const (no title)', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						oneOf: [{ const: 'on' }, { const: 'off' }]
					}
				}
			};

			const result = normalizeEnums(schema);

			// Should not transform since items don't have both title and const
			expect(result.schema.properties?.status).toHaveProperty('oneOf');
		});

		it('should preserve other schema properties when transforming', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						type: 'string',
						title: 'Status Field',
						description: 'Select a status',
						default: 'on',
						oneOf: [
							{ const: 'on', title: 'On' },
							{ const: 'off', title: 'Off' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.status).toEqual({
				type: 'string',
				title: 'Status Field',
				description: 'Select a status',
				default: 'on',
				enum: ['on', 'off']
			});
		});

		it('should handle schema with $ref (pass through unchanged)', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					status: {
						$ref: '#/definitions/Status'
					}
				},
				definitions: {
					Status: {
						type: 'string',
						oneOf: [
							{ const: 'on', title: 'On' },
							{ const: 'off', title: 'Off' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			// $ref should be preserved, definitions should be transformed
			expect(result.schema.properties?.status).toEqual({ $ref: '#/definitions/Status' });
			expect(result.schema.definitions?.Status).toEqual({
				type: 'string',
				oneOf: [
					{ const: 'on', title: 'On' },
					{ const: 'off', title: 'Off' }
				]
			});
		});

		it('should handle numeric const values', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					priority: {
						type: 'number',
						oneOf: [
							{ const: 1, title: 'Low' },
							{ const: 2, title: 'Medium' },
							{ const: 3, title: 'High' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.priority).toEqual({
				type: 'number',
				enum: [1, 2, 3]
			});
			expect(result.uiSchema).toEqual({
				priority: {
					'ui:enumNames': ['Low', 'Medium', 'High']
				}
			});
		});

		it('should handle boolean const values', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					enabled: {
						type: 'boolean',
						oneOf: [
							{ const: true, title: 'Enabled' },
							{ const: false, title: 'Disabled' }
						]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema.properties?.enabled).toEqual({
				type: 'boolean',
				enum: [true, false]
			});
			expect(result.uiSchema).toEqual({
				enabled: {
					'ui:enumNames': ['Enabled', 'Disabled']
				}
			});
		});
	});

	describe('allOf, anyOf combinations', () => {
		it('should handle schema with allOf containing oneOf', () => {
			const schema: RJSFSchema = {
				type: 'object',
				allOf: [
					{
						properties: {
							status: {
								type: 'string',
								oneOf: [
									{ const: 'on', title: 'On' },
									{ const: 'off', title: 'Off' }
								]
							}
						}
					}
				]
			};

			const result = normalizeEnums(schema);

			expect(result.schema.allOf?.[0]?.properties?.status).toEqual({
				type: 'string',
				enum: ['on', 'off']
			});
		});

		it('should handle schema with anyOf (not transformed)', () => {
			const schema: RJSFSchema = {
				type: 'object',
				properties: {
					value: {
						anyOf: [{ type: 'string' }, { type: 'number' }]
					}
				}
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual(schema);
			expect(result.uiSchema).toEqual({});
		});
	});

	describe('root level oneOf', () => {
		it('should handle oneOf at root level', () => {
			const schema: RJSFSchema = {
				type: 'string',
				oneOf: [
					{ const: 'a', title: 'Option A' },
					{ const: 'b', title: 'Option B' }
				]
			};

			const result = normalizeEnums(schema);

			expect(result.schema).toEqual({
				type: 'string',
				enum: ['a', 'b']
			});
			expect(result.uiSchema).toEqual({
				'ui:enumNames': ['Option A', 'Option B']
			});
		});
	});
});

describe('normalizeEnums option lists carrying state', () => {
	// KFE-3322: the asset list was a `oneOf` of {title, const, disabled} branches, and the old
	// exact-keys check refused to collapse it. 1764 branches then compiled to a validator nested
	// 1764 levels deep and overflowed V8's parser stack inside AJV's `new Function`.
	it('should collapse a oneOf whose branches are disabled and list them in ui:enumDisabled', () => {
		const schema = {
			type: 'object',
			properties: {
				assetName: {
					type: 'string',
					oneOf: [
						{ const: 'asset-1', title: 'Asset 1', disabled: false },
						{ const: 'asset-2', title: 'Asset 2', disabled: true },
						{ const: 'asset-3', title: 'Asset 3', disabled: true }
					]
				}
			}
		} as unknown as RJSFSchema;

		const result = normalizeEnums(schema);

		expect(result.schema.properties?.assetName).toEqual({ type: 'string', enum: ['asset-1', 'asset-2', 'asset-3'] });
		expect(result.uiSchema).toEqual({
			assetName: {
				'ui:enumNames': ['Asset 1', 'Asset 2', 'Asset 3'],
				'ui:enumDisabled': ['asset-2', 'asset-3']
			}
		});
	});

	it('should not emit ui:enumDisabled when nothing is disabled', () => {
		const schema = {
			type: 'object',
			properties: {
				status: {
					type: 'string',
					oneOf: [
						{ const: 'on', title: 'On', disabled: false },
						{ const: 'off', title: 'Off', disabled: false }
					]
				}
			}
		} as unknown as RJSFSchema;

		const result = normalizeEnums(schema);

		expect(result.uiSchema).toEqual({ status: { 'ui:enumNames': ['On', 'Off'] } });
	});

	it('should place the derived keys at the property path for an array of enums', () => {
		const schema = {
			type: 'object',
			properties: {
				asset_names: {
					type: 'array',
					uniqueItems: true,
					items: {
						type: 'string',
						oneOf: [
							{ const: 'a', title: 'A', disabled: true },
							{ const: 'b', title: 'B', description: 'The second one' }
						]
					}
				}
			}
		} as unknown as RJSFSchema;

		const result = normalizeEnums(schema);

		// RJSF's ArrayField hands the ARRAY's uiSchema to optionsList and getUiOptions, never uiSchema.items
		expect(result.uiSchema).toEqual({
			asset_names: {
				'ui:enumNames': ['A', 'B'],
				'ui:enumDisabled': ['a'],
				'ui:enumDescriptions': ['', 'The second one']
			}
		});
	});

	it('should leave a discriminated union alone', () => {
		const schema: RJSFSchema = {
			type: 'object',
			properties: {
				authentication: {
					oneOf: [
						{ type: 'object', properties: { type: { const: 'credentials' } }, required: ['credentials'] },
						{ type: 'object', properties: { type: { const: 'certificate' } }, required: ['certificate'] }
					]
				}
			}
		};

		const result = normalizeEnums(schema);

		expect(result.schema.properties?.authentication).toHaveProperty('oneOf');
		expect(result.uiSchema).toEqual({});
	});

	it('should leave a oneOf inside definitions alone, since its titles have nowhere to go', () => {
		const schema: RJSFSchema = {
			definitions: {
				assetOptions: {
					type: 'string',
					oneOf: [
						{ const: 'a', title: 'A' },
						{ const: 'b', title: 'B' }
					]
				}
			},
			type: 'object',
			properties: {
				asset: { $ref: '#/definitions/assetOptions' }
			}
		};

		const result = normalizeEnums(schema);

		expect(result.schema.definitions?.assetOptions).toHaveProperty('oneOf');
		expect(result.uiSchema).toEqual({});
	});

	it('should never build an array inside the uiSchema', () => {
		const schema: RJSFSchema = {
			type: 'object',
			allOf: [
				{
					properties: {
						status: {
							type: 'string',
							oneOf: [
								{ const: 'on', title: 'On' },
								{ const: 'off', title: 'Off' }
							]
						}
					}
				}
			]
		};

		const result = normalizeEnums(schema);

		// an allOf index must not reach the uiSchema path - lodash set() would turn it into an array
		expect(result.uiSchema).toEqual({ status: { 'ui:enumNames': ['On', 'Off'] } });
		expect(Array.isArray(result.uiSchema.status)).toBe(false);
	});
});

describe('normalizeEnums reporting', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	const buildLongOneOf = (branch: (index: number) => Record<string, unknown>): RJSFSchema => ({
		type: 'object',
		properties: {
			assetName: {
				type: 'string',
				oneOf: Array.from({ length: 150 }, (_unused, index) => branch(index))
			}
		}
	});

	it('should report a long option list it could not collapse', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		normalizeEnums(buildLongOneOf(index => ({ const: `a-${index}`, title: `A ${index}`, readOnly: true })));

		expect(error).toHaveBeenCalledTimes(1);
		expect(error.mock.calls[0][0]).toContain('assetName');
		expect(error.mock.calls[0][0]).toContain('150');
		expect(error.mock.calls[0][0]).toContain('readOnly');
	});

	it('should stay silent for a long option list it did collapse', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		normalizeEnums(buildLongOneOf(index => ({ const: `a-${index}`, title: `A ${index}`, disabled: false })));

		expect(error).not.toHaveBeenCalled();
	});

	it('should stay silent for a short option list it could not collapse', () => {
		const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);

		normalizeEnums({
			type: 'object',
			properties: { status: { type: 'string', oneOf: [{ const: 'on', title: 'On', readOnly: true }] } }
		} as RJSFSchema);

		expect(error).not.toHaveBeenCalled();
	});
});

describe('getInitialFormData', () => {
	const asOneOf: RJSFSchema = {
		type: 'object',
		properties: {
			security_policy: {
				type: 'string',
				default: 'none',
				oneOf: [
					{ const: 'none', title: 'None' },
					{ const: 'Basic256', title: 'Basic256' }
				]
			}
		}
	};
	const asEnum: RJSFSchema = {
		type: 'object',
		properties: {
			security_policy: { type: 'string', default: 'none', enum: ['none', 'Basic256'] }
		}
	};

	it('should normalize the schema by default', () => {
		// the parameter used to be called normalizeSchema and only stripped $schema, so every caller
		// leaving it at its default handed a raw oneOf straight to AJV
		const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
		const oneOfData = getInitialFormData(asOneOf, { security_policy: 'Basic256' });
		const enumData = getInitialFormData(asEnum, { security_policy: 'Basic256' });
		spy.mockRestore();

		expect(oneOfData).toEqual(enumData);
	});

	it('should return the same form data whether the options are a oneOf or an enum', () => {
		const cases: unknown[] = [undefined, { security_policy: 'Basic256' }, { security_policy: 'no-longer-offered' }, { security_policy: '' }];

		cases.forEach(formData => {
			[EApplyDefaults.All, EApplyDefaults.RequiredOnly, EApplyDefaults.Never].forEach(applyDefaults => {
				expect(getInitialFormData(asOneOf, formData, undefined, applyDefaults)).toEqual(getInitialFormData(asEnum, formData, undefined, applyDefaults));
			});
		});
	});

	it('should leave the schema untouched when told the caller already normalized', () => {
		const { schema } = normalizeSchema(asOneOf);

		expect(getInitialFormData(schema, undefined, undefined, undefined, false)).toEqual(getInitialFormData(asOneOf, undefined));
	});
});
