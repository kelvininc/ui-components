```tsx
import React from 'react';
import { KvTree } from '@kelvininc/react-ui-components';

export const TreeExample: React.FC = () => (
	<>
		{/*-- With required props --*/}
		<KvTree nodes={myTreeNodes}></KvTree>
		
		{/*-- With required props and all tree loading --*/}
		<KvTree nodes={myTreeNodes} loading></KvTree>
		
		{/*-- With required props and selected node --*/}
		<KvTree nodes={myTreeNodes} selectedNode="node-id"></KvTree>

		{/*-- With required props and hidden nodes dictionary --*/}
		<KvTree
			nodes={myTreeNodes}
			hiddenNodes={myHiddenNodes}>
		</KvTree>
		
		{/*-- With required props and expanded nodes dictionary --*/}
		<KvTree
			nodes={myTreeNodes}
			expandedNodes={myExpandedNodes}>
		</KvTree>
		
		{/*-- With required props and disabled nodes dictionary --*/}
		<KvTree
			nodes={myTreeNodes}
			disabledNodes={myDisabledNodes}>
		</KvTree>
		
		{/*-- With required props and highlighted nodes dictionary --*/}
		<KvTree
			nodes={myTreeNodes}
			highlightedNodes={myHighlightedNodes}>
		</KvTree>
		
		{/*-- With required props and loading nodes dictionary --*/}
		<KvTree
			nodes={myTreeNodes}
			loadingNodes={myLoadingNodes}>
		</KvTree>
	</>
);
```
