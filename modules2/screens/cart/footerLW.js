import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	Dimensions,
} from 'react-native'
import { Model } from '../../Model';
import { GioHang } from "../../Model/tableSQL";
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
	sumFooter = (callback) => {
		GioHang.sumGioHangs(null, (res)=> {
			if(callback)
				callback(res);
		});
	}
	render() {
		let this_sav = this;
		let dtsl = this_sav.state.dtsl;
		return (
			dtsl <= 0 ? (
				<View style={{ marginVertical: 5, padding: 10, backgroundColor: '#FFFFFF', alignItems: 'center' }}>
					<Text style={{ color: '#7f7d7d', fontSize: 16 }}>Have no records</Text>
				</View>
			) : (
				<View style={{ flex: 1, flexDirection: 'column', padding: 10, backgroundColor: '#CCC' }}>
					<View style={{ flex: 1, flexDirection: 'row', paddingBottom: 5 }}>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: 'black' }}>Quantity</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: 'black' }}>CBM</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 14, color: 'black' }}>Amount</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 14, color: 'blue' }}>
							{Model.toNumberStr(this_sav.state.sum_qty)}
						</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 14, color: 'blue' }}>
							{Model.toNumberStr(this_sav.state.sum_cbm)}
						</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 14, color: 'blue' }}>
							${Model.toNumberStr(this_sav.state.sum_amount)}
						</Text>
					</View>
				</View>
			)
		)
	}
}

