```html
<!-- Default -->
<kv-toggle-tip text="Toggle tip">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>

<!-- With Fixed Position -->
<kv-toggle-tip text="Toggle tip" [position]="ETooltipPosition.Left">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>

<!-- With Allowed Position -->
<kv-toggle-tip text="Toggle tip" [allowedPositions]="[ETooltipPosition.Top, ETooltipPosition.Bottom]">
	<kv-icon slot="open-element-slot" name={EIconName.Info}/>
	<kv-action-button [type]="EActionButtonType.Primary" slot="content-slot">Learn More</kv-action-button>
</kv-toggle-tip>
```
