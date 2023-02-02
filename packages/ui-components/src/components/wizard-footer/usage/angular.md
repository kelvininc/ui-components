```html
<!-- Default -->
<kv-wizard-footer
	[steps]="stepsSuccess"
	[currentStep]="currentStep"
	progressPercentage="50"
	(onStepClick)="onStepClick($event)"
	(onPrevClick)="onPrevClick()"
	(onNextClick)="onNextClick()"
/>

<!-- Has errors -->
<kv-wizard-footer
	[steps]="stepsError"
	[currentStep]="currentStep"
	progressPercentage="50"
	(onStepClick)="onStepClick($event)"
	(onPrevClick)="onPrevClick()"
	(onNextClick)="onNextClick()"
	hasError
/>
```
