import { IModal } from '@kelvininc/ui-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { KvModal } from '..';
import { IModalState } from './modal-controller.types';

const modalRoot = document.getElementById('modal-root');

class ModalPortal extends React.Component {
	el: HTMLDivElement;
	constructor(props: any) {
		super(props);
		this.el = document.createElement('div');
	}

	componentDidMount() {
		modalRoot?.appendChild(this.el);
	}

	componentWillUnmount() {
		modalRoot?.removeChild(this.el);
	}

	render() {
		// eslint-disable-next-line react/prop-types
		return ReactDOM.createPortal(this.props.children, this.el);
	}
}

export class ModalController extends React.Component<IModal, IModalState> {
	constructor(props: IModal) {
		super(props);

		this.state = {
			modalTitle: props.modalTitle,
			center: props.center,
			closeClickOutside: props.closeClickOutside,
			modalActive: true
		};
	}

	onClickCloseButton(event: CustomEvent<MouseEvent>) {
		event.preventDefault();
		this.setState({ modalActive: false });
	}

	render() {
		const { modalTitle, center, closeClickOutside, modalActive } = this.state;

		return (
			<>
				{modalActive && (
					<ModalPortal>
						<KvModal modalTitle={modalTitle} center={center} closeClickOutside={closeClickOutside} onClickCloseButton={this.onClickCloseButton}></KvModal>
					</ModalPortal>
				)}
			</>
		);
	}
}
