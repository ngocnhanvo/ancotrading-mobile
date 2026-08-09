import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import styles from './styles.js';
import { Model } from '../../Model/index.js';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class Items extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rowData: {...props.rowData},
			index: props.index,
			pageSep: props.pageSep,
			pageNum: props.pageNum
		};
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		let index = this_sav.state.index + 1 + (this_sav.state.pageSep - 1) * this_sav.state.pageNum;
		let optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		return (
			<View 
				key={rowData.index} 
				style={{
					borderBottomWidth: 0.7
					, borderBottomColor: '#ccc'
					, backgroundColor: '#FFF'
				}}
			>
				<View style={{ height: 90, marginTop: 10 }}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{flex:0.8, marginLeft: 10}}>
							<Text style={[styles.detail_row,{fontWeight: 'bold'}]}>
								{rowData.ten_dtkd}
							</Text>
						</View>
						<View style={{flex:0.2, marginRight: 10}}>
							<TouchableOpacity  
								onPress={() => {
									if(Model.formQuoSent) {
										Model.formQuoSent.state.BaoGiaID = rowData.BaoGiaID;
										Model.formQuoSent.state.date = rowData.date;
										Model.formQuoSent.state.ma_dtkd = rowData.ma_dtkd;
										Model.formQuoSent.state.ten_dtkd = rowData.ten_dtkd;
										Model.formQuoSent.state.nguoilienhe = rowData.nguoilienhe;
										Model.formQuoSent.state.phone = rowData.phone;
										Model.formQuoSent.state.email = rowData.email;
										Model.formQuoSent.state.address = rowData.address;
										Model.formQuoSent.state.note = rowData.note;
										Model.formQuoSent.state.note2 = rowData.note2;
										Model.formQuoSent.state.status = rowData.status;
										Model.formQuoSent.state.qotype = rowData.qotype;
										Model.formQuoSent.setState({display0: false}, ()=>{
											Model.headerQuoSent.forceUpdate();
										});
									}
								}}
							>
								<Text style={[styles.detail_row,{textAlign:'right' }, styles.underLine]}>
									View
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'row', marginLeft: 10}}>
						<Text style={styles.detail_row}>{rowData.email}</Text>
					</View>
					<View style={{ flexDirection: 'row'}}>
						<View style={{flex:0.6, marginLeft: 10}}>
							<Text style={styles.detail_row}>
								{(new Date(rowData.date)).toLocaleDateString("en-US", optionsDate)}
							</Text>
						</View>
						<View style={{flex:0.4, marginLeft: 10, marginRight: 10}}>
							<Text style={[styles.detail_row, {textAlign: 'right', color: rowData.status == 0 ? 'red': 'blue'}]}>
								Status: {rowData.status == 0 ? 'Wait': 'Sent'}
							</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

