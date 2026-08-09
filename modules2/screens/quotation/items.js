import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import { Icon } from '../../tools/native-base';
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
				<View style={{ height: 115, marginTop: 10 }}>
					<View style={{ flexDirection: 'row'}}>
						<View style={{flex:0.8, marginLeft: 10}}>
							<Text style={[styles.detail_row,{fontWeight: 'bold'}]}>
								{rowData.ten_dtkd}
							</Text>
						</View>
						<View style={{flex:0.2, marginRight: 10, display: rowData.status == 0 ? 'flex' : 'none'}}>
							<TouchableOpacity  
								onPress={() => {
									if(Model.formQuo) {
										Model.formQuo.state.rowData = rowData;
										Model.formQuo.state.BaoGiaID = rowData.BaoGiaID;
										Model.formQuo.state.date = rowData.date;
										Model.formQuo.state.qotype = rowData.qotype;
										Model.formQuo.state.ma_dtkd = rowData.ma_dtkd;
										Model.formQuo.state.ten_dtkd = rowData.ten_dtkd;
										Model.formQuo.state.nguoilienhe = rowData.nguoilienhe;
										Model.formQuo.state.phone = rowData.phone;
										Model.formQuo.state.email = rowData.email;
										Model.formQuo.state.address = rowData.address;
										Model.formQuo.state.note = rowData.note;
										Model.formQuo.state.note2 = rowData.note2;
										Model.formQuo.state.status = rowData.status;
										Model.formQuo.setState({display0: false}, ()=>{
											Model.headerQuo.forceUpdate();
											Model.footerQuo.forceUpdate();
										});
									}
								}}
							>
								<Text style={[styles.detail_row,{textAlign:'right' }, styles.underLine]}>
									Edit
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'row', marginLeft: 10, marginTop: 10}}>
						<Text style={styles.detail_row}>{rowData.email}</Text>
						<View style={{flex:1, height: 40}}>
							<TouchableOpacity 
								style={{opacity: Model.UserName ? 1 : 0.1, flex: 1}}
								onPress={()=>{
									if(!Model.UserName)
									{
										alert(`Please login`);
										return;
									}
									rowData.checked = !rowData.checked;
									this_sav.state.rowData = rowData;
									let qo = Model.this_sav.state.dataSource.filter((a)=>{
										return a.BaoGiaID == rowData.BaoGiaID
									})[0];
									if(qo) {
										qo.checked = rowData.checked;
									}
									this_sav.forceUpdate();
								}}
							>
								<Icon name={rowData.checked ? "md-checkbox" : "md-square-outline"} style={{ fontSize: 40, textAlign: 'right', flex: 1, right: 10 }} />
							</TouchableOpacity>
						</View>
					</View>
					<View style={{ flexDirection: 'row'}}>
						<View style={{flex:0.6, marginLeft: 10}}>
							<Text style={styles.detail_row}>
								{(new Date(rowData.date)).toLocaleDateString("en-US", optionsDate)}
							</Text>
						</View>
						<View style={{flex:0.4, marginLeft: 10, marginRight: 10}}>
							<Text style={[styles.detail_row, {textAlign: 'right', color: rowData.status == 0 ? 'red': 'blue'}]}>
								Status: {rowData.status == 0 ? 'Pending': 'Sent'}
							</Text>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

