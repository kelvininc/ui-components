
export const calcDargPos = (e, obj) => {
	var m_posx = 0,
		m_posy = 0,
		e_posx = 0,
		e_posy = 0;
	//get mouse position on document crossbrowser
	if (!e) {
		e = window.event;
	}
	if (e.pageX || e.pageY) {
		m_posx = e.pageX;
		m_posy = e.pageY;
	} else if (e.clientX || e.clientY) {
		m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		m_posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	//get parent element position in document
	if (obj.offsetParent) {
		do {
			e_posx += obj.offsetLeft;
			e_posy += obj.offsetTop;
		} while ((obj = obj.offsetParent));
	}
	console.log('calcDargPos');
	console.log('\t mouse pos:', m_posy);
	console.log('\t element pos:', e_posy);
	// mouse position minus elm position is mouseposition relative to element:
	return {
		x: m_posx - e_posx,
		y: m_posy - e_posy
	};
}
