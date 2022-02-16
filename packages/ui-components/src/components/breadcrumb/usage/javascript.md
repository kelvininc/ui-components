```html
<!-- With items -->
<kv-breadcrumb></kv-breadcrumb>

<script>
	const breadcrumbEl = document.querySelector('kv-breadcrumb');
	breadcrumbEl.items = [
		{
			label: 'Your item label here',
			href: 'Your item link here',
			/**
			 * Check https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
			 * for a list of possible values. At the moment 'framename' is not supported.
			*/
			target: '_blank',
			/**
			 * Not mandatory, by default the component will set the 'active' attribute to the last item on 
			 * the array, this will disable click events and emphasize the item in bold.
			*/
			active: undefined
		}
	];
</script>
```