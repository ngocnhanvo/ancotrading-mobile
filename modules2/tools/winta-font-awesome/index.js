import React, { PureComponent } from 'react'
import {
  Text 
} from 'react-native'
import PropTypes from 'prop-types'
const NameToSign = (props) => {
	let styleF = props.style;
	let name04 = props.name.substring(0, 4);
	if(styleF == null) {
		styleF = {};
	}
	
	if(name04.lastIndexOf('fa-') > -1) {
		styleF.fontFamily = 'FontAwesome';
	}
	else if(name04.lastIndexOf('ion-') > -1) {
		styleF.fontFamily = 'Ionicons';
	}
	
	if(!styleF.fontSize) {
		styleF.fontSize = 24;
	}
	let name = props.name;
	let sign = [];
	switch (name) {
		//#region FontAwesome
		case "fa-address-book": 
			sign.push(<Text key={name} style={styleF}>&#xf2b9;</Text>);
			break;
		case "fa-bars":
			sign.push(<Text key={name} style={styleF}>&#xf0c9;</Text>);
			break;
		case "fa-train": 
			sign.push(<Text key={name} style={styleF}>&#xf238;</Text>);
			break;
		case "fa-exchange":
			sign.push(<Text key={name} style={styleF}>&#xf0ec;</Text>);
			break;
		case "fa-shopping-cart":
			sign.push(<Text key={name} style={styleF}>&#xf07a;</Text>);
			break;
		case "fa-users":
			sign.push(<Text key={name} style={styleF}>&#xf0c0;</Text>);
			break;
		case "fa-calculator":
			sign.push(<Text key={name} style={styleF}>&#xf1ec;</Text>);
			break;
		case "fa-cog":
			sign.push(<Text key={name} style={styleF}>&#xf013;</Text>);
			break;
		case "fa-home":
			sign.push(<Text key={name} style={styleF}>&#xf015;</Text>);
			break;
		case "fa-sign-in":
			sign.push(<Text key={name} style={styleF}>&#xf090;</Text>);
			break;
		case "fa-sign-out":
			sign.push(<Text key={name} style={styleF}>&#xf08b;</Text>);
			break;
		case "fa-clock-o":
			sign.push(<Text key={name} style={styleF}>&#xf017;</Text>);
			break;
		case "fa-star":
			sign.push(<Text key={name} style={styleF}>&#xf005;</Text>);
			break;
		case "fa-wifi":
			sign.push(<Text key={name} style={styleF}>&#xf1eb;</Text>);
			break;
		case "fa-qrcode":
			sign.push(<Text key={name} style={styleF}>&#xf029;</Text>);
			break;
		case "fa-cart-plus":
			sign.push(<Text key={name} style={styleF}>&#xf217;</Text>);
			break;
		case "fa-search":
			sign.push(<Text key={name} style={styleF}>&#xf002;</Text>);
			break;
		case "fa-history":
			sign.push(<Text key={name} style={styleF}>&#xf1da;</Text>);
			break;
		case "fa-barcode":
			sign.push(<Text key={name} style={styleF}>&#xf02a;</Text>);
			break;
		case "fa-bug":
			sign.push(<Text key={name} style={styleF}>&#xf188;</Text>);
			break;
		case "fa-arrow-left":
			sign.push(<Text key={name} style={styleF}>&#xf060;</Text>);
			break;
		//#endregion FontAwesome
		
		//#region FontIonic
		case "ion-md-shuffle":
			sign.push(<Text key={name} style={styleF}>&#xf37b;</Text>);
			break;
		case "ion-md-calculator":
			sign.push(<Text key={name} style={styleF}>&#xf2aa;</Text>);
			break;
		case "ion-md-train":
			sign.push(<Text key={name} style={styleF}>&#xf258;</Text>);
			break;
		case "ion-md-calculator":
			sign.push(<Text key={name} style={styleF}>&#xf396;</Text>);
			break;
		case "ion-md-cart":
			sign.push(<Text key={name} style={styleF}>&#xf2b4;</Text>);
			break;
		case "ion-md-person":
			sign.push(<Text key={name} style={styleF}>&#xf345;</Text>);
			break;
		case "ion-md-settings":
			sign.push(<Text key={name} style={styleF}>&#xf377;</Text>);
			break;
		case "ion-md-bookmarks":
			sign.push(<Text key={name} style={styleF}>&#xf2a0;</Text>);
			break;
		case "ion-md-list-box":
			sign.push(<Text key={name} style={styleF}>&#xf31a;</Text>);
			break;
		case "ion-md-chatboxes":
			sign.push(<Text key={name} style={styleF}>&#xf2b6;</Text>);
			break;
		case "ion-md-clipboard":
			sign.push(<Text key={name} style={styleF}>&#xf2bd;</Text>);
			break;
		case "ion-md-calendar":
			sign.push(<Text key={name} style={styleF}>&#xf2ab;</Text>);
			break;
		case "ion-md-pin":
			sign.push(<Text key={name} style={styleF}>&#xf34a;</Text>);
			break;
		case "ion-md-stats":
			sign.push(<Text key={name} style={styleF}>&#xf385;</Text>);
			break;
		case "ion-md-warning":
			sign.push(<Text key={name} style={styleF}>&#xf3a5;</Text>);
			break;
		case "ion-md-information-circle":
			sign.push(<Text key={name} style={styleF}>&#xf311;</Text>);
			break;
		case "ion-md-sad":
			sign.push(<Text key={name} style={styleF}>&#xf373;</Text>);
			break;
		case "ion-md-arrow-back":
			sign.push(<Text key={name} style={styleF}>&#xf27d;</Text>);
			break;
		//#endregion FontIonic
	}
	return sign;
}

export default class FontAwesome extends PureComponent {
	static propTypes = {
		name: PropTypes.string,
		style: PropTypes.object
	}

	constructor(props) {
		super(props)
		this.styleF = "";
	}

	componentDidMount() {
		
		
	}

	render() {
		let textSign = NameToSign(this.props);
		return textSign;
	}
}
