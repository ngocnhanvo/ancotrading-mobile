import React, {
	Component
} from 'react'
import { View, Text } from 'react-native'
import { Model } from '../../../Model';
import { BaoGiaSP } from "../../../Model/tableSQL";

export default class FooterLW extends Component {
	constructor(props) {
		super(props);
		this.state = { dtsl: 0, sum_qty: 0, sum_qtyPallet: 0, sum_totalQty: 0, invalidOuter: 0, sum_cbm: 0, sum_amount: 0 };
	}
	sumFooter = (BaoGiaID, callback) => {
		const where = `BaoGiaID='${BaoGiaID}'`;
		BaoGiaSP.sumBaoGiaSPs({where}, (res) => {
			if(callback) callback(res);
		});
	}
	render() {
		const summary = [
			{label: 'Quantity Items', value: Model.toNumberStr(Number(this.state.sum_qty) || 0)},
			{label: 'CBM', value: this.state.invalidOuter > 0 ? 'SL Outer required' : Model.toNumberStr(Number(this.state.sum_cbm) || 0)},
			{label: 'Quantity Pallet/thùng/kiện', value: Model.toNumberStr(Number(this.state.sum_qtyPallet) || 0)},
			{label: 'Amount', value: this.state.invalidOuter > 0 ? 'SL Outer required' : '$' + Model.toNumberStr(Number(this.state.sum_amount) || 0)}
		];
		if(this.state.dtsl <= 0) {
			return (
				<View style={{marginVertical: 5, padding: 10, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
					<Text style={{color: '#7f7d7d', fontSize: 16}}>Have no records</Text>
				</View>
			);
		}
		return (
			<View style={{padding: 8, backgroundColor: '#f1f3f0'}}>
				{[0, 1].map(row => (
					<View key={row} style={{flexDirection: 'row'}}>
						{summary.slice(row * 2, row * 2 + 2).map(item => (
							<View key={item.label} style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								paddingVertical: 8,
								paddingHorizontal: 5,
								borderBottomWidth: row === 0 ? 1 : 0,
								borderBottomColor: '#d7ddd3'
							}}>
								<Text style={{color: '#242b24', textAlign: 'center', fontWeight: 'bold', fontSize: 13}}>
									{item.label}
								</Text>
								<Text style={{color: '#1646b5', textAlign: 'center', fontSize: 15, marginTop: 4}}>
									{item.value}
								</Text>
							</View>
						))}
					</View>
				))}
				<View style={{alignItems: 'center', paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#d7ddd3'}}>
					<Text style={{fontWeight: 'bold', color: '#242b24'}}>Total Qty (Items + Pallet × SL Outer)</Text>
					<Text style={{fontSize: 16, color: '#1646b5', marginTop: 3}}>
						{this.state.invalidOuter > 0 ? 'SL Outer required' : Model.toNumberStr(Number(this.state.sum_totalQty) || 0)}
					</Text>
				</View>
			</View>
		);
	}
}
