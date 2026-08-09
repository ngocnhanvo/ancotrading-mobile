import React, {
	Component
} from 'react'
import {
	View,
	Text,
	Dimensions,
} from 'react-native'
import { Model } from '../../../Model';
import { BaoGiaSP } from "../../../Model/tableSQL";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FooterLW extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dtsl: 0
		};
	}
	sumFooter = (BaoGiaID, callback) => {
		const where = `BaoGiaID='${BaoGiaID}'`;
		BaoGiaSP.sumBaoGiaSPs({where}, (res)=> {
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
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Quantity</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>CBM</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontWeight: 'bold', fontSize: 15 }}>Amount</Text>
					</View>
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 15, color: 'blue' }}>
							{this_sav.state.sum_qty}
						</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 15, color: 'blue' }}>
							{this_sav.state.sum_cbm}
						</Text>
						<Text style={{ flex: 0.333333, textAlign: 'center', fontSize: 15, color: 'blue' }}>
							${this_sav.state.sum_amount}
						</Text>
					</View>
				</View>
			)
		)
	}
}

