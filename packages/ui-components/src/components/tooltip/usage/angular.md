```html
<!-- Default -->
<kv-tooltip text="Tooltip">
	<kv-action-button [type]="EActionButtonType.Primary">Hover me!</kv-action-button>
</kv-tooltip>

<!-- With Fixed Position -->
<kv-tooltip text="Tooltip" [position]="ETooltipPosition.Left">
	<kv-action-button [type]="EActionButtonType.Primary">Hover me!</kv-action-button>
</kv-tooltip>

<!-- With Allowed Position -->
<kv-tooltip text="Tooltip" [allowedPositions]="[ETooltipPosition.Top, ETooltipPosition.Bottom]">
	<kv-action-button [type]="EActionButtonType.Primary">Hover me!</kv-action-button>
</kv-tooltip>
```
