import { IToaster } from '@kelvininc/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { KvToaster } from '../stencil-generated';
import { IToasterState } from './toaster-controller.types';

const toasterRoot = document.getElementById('toaster-root');

class ToasterPortal extends React.Component {
	el: HTMLDivElement;
	constructor(props: any) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		toasterRoot?.appendChild(this.el);
	}

	componentWillUnmount() {
		toasterRoot?.removeChild(this.el);
	}

	render() {
		// eslint-disable-next-line react/prop-types
		return ReactDOM.createPortal(this.props.children, this.el);
	}
}

export class ToasterController extends React.Component<IToaster, IToasterState> {
	constructor(props: IToaster) {
		super(props);

		this.state = {
			header: props.header,
			description: props.description,
			type: props.type,
			ttl: props.ttl,
			toasterActive: true
		};
	}

	onClickCloseButton(event: CustomEvent<MouseEvent>) {
		event.preventDefault();
		this.setState({ toasterActive: false });
	}

	onTtlExpired(event: CustomEvent<CloseEvent>) {
		event.preventDefault();
		this.setState({ toasterActive: false });
	}

	render() {
		const { header, description, type, ttl, toasterActive } = this.state;

		return (
			<>
				{toasterActive && (
					<ToasterPortal>
						<KvToaster
							header={header}
							description={description}
							type={type}
							ttl={ttl}
							onClickCloseButton={this.onClickCloseButton}
							onTtlExpired={this.onTtlExpired}
						></KvToaster>
					</ToasterPortal>
				)}
			</>
		);
	}
}
