import { describe, it, expect } from 'vitest';
import { normalizeEnums } from './schema-form';
import { RJSFSchema } from '@rjsf/utils';

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

		it('should not transform oneOf that has keys other than title/const', () => {
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

			expect(result.schema.properties?.status).toHaveProperty('oneOf');
			expect(result.uiSchema).toEqual({});
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
