import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	Dimensions,
} from 'react-native'
import { Model } from '../../Model';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FooterLW extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dtsl: 0
		};
	}
	render() {
		let this_sav = this;
		let dtsl = this_sav.state.dtsl;
		return (
			dtsl <= 0 ? (
				<View style={{ marginVertical: 5, padding: 10, backgroundColor: '#FFFFFF', alignItems: 'center' }}>
					<Text style={{ color: '#7f7d7d', fontSize: 16 }}>Have no records</Text>
				</View>
			) : <View></View>
		)
	}
}

