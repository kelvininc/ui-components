export const SCHEMA_FORM_STRINGS = {
	item: 'Item',
	moveUp: (name: string) => `Move ${name} up`,
	moveDown: (name: string) => `Move ${name} down`,
	remove: (name: string) => (name ? `Remove ${name}` : 'Remove'),
	add: (name: string) => `Add ${name}`,
	addItem: (name?: string) => (name ? `Add item to ${name}` : 'Add item'),
	addProperty: (name?: string) => (name ? `Add property to ${name}` : 'Add property'),
	download: (name: string) => `Download ${name || 'file'}`
} as const;
