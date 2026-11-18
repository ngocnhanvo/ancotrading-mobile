import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import styles from './styles.js';
import Clipboard from '@react-native-clipboard/clipboard';
import { Model } from '../../Model';
import { validateQuantity, getLineAmount, getLineCbm } from '../../Model/quantity';
import { GioHang, ThongTinSP } from "../../Model/tableSQL";
import Detail from '../scan/detail.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class Items extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rowData: {...props.rowData},
			opacity: 1
		};
	}
	addorUpdate = (this_sav, rowData, type) => {
		let res = Model.detailScan.state.res;
		let itemSel = res.itemNo;
		if(type) {
			if(res.itemNo == rowData.itemNo) {
				alert(`Product "${res.itemNo}" already exists`);
				return;
			}
		}
		let qty = Model.detailScan.state.qty;
		let qtyPallet = Model.detailScan.state.qtyPallet;
		let note = Model.detailScan.state.note;
		
		
		const quantityError = validateQuantity({qty, qtyPallet, slOuter: res.slOuter}, Model.maxVal);
		if(quantityError) {
			alert(quantityError);
			return;
		}

		let selCL = rowData.itemNo != itemSel;

		if(selCL || rowData.qty != qty || Number(rowData.qtyPallet || 0) !== qtyPallet || rowData.note != note) {
			ThongTinSP.getThongTinSPs({searchStr: itemSel, dateStr: rowData.dateStr, page: 1, take: 1}, (datas) => {
				if(datas.length <= 0) {
					alert(`"${itemSel}" doesn't exist in the "Search Product" menu`);
				}
				else {
					datas[0].scan = false;
					datas[0].selCL = selCL;
					datas[0].qty = qty;
					datas[0].qtyPallet = qtyPallet;
					datas[0].slOuter = Number(datas[0].slOuter) > 0 ? datas[0].slOuter : (itemSel === rowData.itemNo ? res.slOuter : datas[0].slOuter);
					datas[0].note = note;
					datas[0].itemNo_old = type ? "000000000" : rowData.itemNo;
					datas[0].index = rowData.index;
					datas[0].GioHangID = rowData.GioHangID;
					datas[0].sizes = res.sizes;
					datas[0].colors = res.colors;
					Model.objectM.sidebar.addtoCart(datas, (msg) => {
						if(msg) {
							alert(msg);
							Model.objectM.spinnerMain.close();
						}
						else {
							Model.objectM.dialogboxMain2.disableOverlayClickClose(false);
							Model.objectM.dialogboxMain2.close();
							
							if(type)
								Model.this_sav.createPage(Model.this_sav);
							else {
								if(Model.this_sav.state.itemsCrt2) {
									if(Model.this_sav.state.itemsCrt2[datas[0].GioHangID]) {
										Model.this_sav.state.itemsCrt2[datas[0].GioHangID].setState({rowData: datas[0]});
									}
								}

								this_sav.setState({rowData: datas[0]},()=> {
									GioHang.sumGioHangs(null, (res)=> {
										if(Model.this_sav.state.footerCrtLW) {
											Model.this_sav.state.footerCrtLW.state.sum_qty = res.qty;
											Model.this_sav.state.footerCrtLW.state.sum_qtyPallet = res.qtyPallet;
											Model.this_sav.state.footerCrtLW.state.sum_totalQty = res.totalQty;
											Model.this_sav.state.footerCrtLW.state.invalidOuter = res.invalidOuter;
											Model.this_sav.state.footerCrtLW.state.invalidCbm = res.invalidCbm;
											Model.this_sav.state.footerCrtLW.state.sum_cbm = res.cbm;
											Model.this_sav.state.footerCrtLW.state.sum_amount = res.amount;
											Model.this_sav.state.footerCrtLW.forceUpdate();
										}
										Model.objectM.spinnerMain.close();	
									});
								});
							}
						}
					});
				}
			});
		}
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		let index = rowData.index;
		return (
			<View 
				key={rowData.itemNo}
				style={{
					borderBottomWidth: 0.7
					, borderBottomColor: '#ccc'
					, backgroundColor: '#FFF'
					, opacity: this_sav.state.opacity
				}}
			>
				<View style={{ paddingVertical: 10 }}>
					<View style={{ flexDirection: 'column', minHeight: 140, padding: 5 }}>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}>{index}</Text>
							<View style={{width: 200}}>
								<TouchableOpacity onPress={() => Clipboard.setString(rowData.itemNo)}>
									<Text style={[styles.detail_row, styles.underLine, {fontWeight: 'bold'}]}>{rowData.itemNo}</Text>
								</TouchableOpacity>
							</View>
							<Text style={[styles.detail_row, {textAlign: 'right', flex: 1}]}>Price: {rowData.price}</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}></Text>
							<Text style={[styles.detail_row, {flex: 1}]}>{rowData.packing}, {rowData.qtyCont}</Text>
							<Text style={[styles.detail_row, {textAlign: 'right'}]}>Quantity Items: {Model.toNumberStr(rowData.qty)}</Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}></Text>
							<Text style={[styles.detail_row, {flex: 1}]}>{rowData.palletSize}</Text>
							<View style={{alignItems: 'flex-end'}}>
								<Text style={[styles.detail_row, {textAlign: 'right', color: '#355d2d'}]}>Quantity Pallet/thùng/kiện: {Model.toNumberStr(Number(rowData.qtyPallet) || 0)}</Text>
							</View>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}></Text>
							<View style={{flex: 1}}>
								<Text style={[styles.detail_row, {color: '#355d2d'}]}>Total CBM: {getLineCbm(rowData) == null ? 'SL Outer required' : Model.toNumberStr(getLineCbm(rowData))}</Text>
							</View>
							<View style={{alignItems: 'flex-end'}}>
								<Text style={[styles.detail_row, {textAlign: 'right'}]}>Total: {getLineAmount(rowData) == null ? 'SL Outer required' : '$' + Model.toNumberStr(getLineAmount(rowData))}</Text>
								<TouchableOpacity 
								style={{alignSelf: 'flex-end'}} 
								onPress={() => {
									Model.objectM.dialogboxMain2.disableOverlayClickClose(true);
									Model.objectM.dialogboxMain2.pop({
										vnnType: 1,
										title: null,
										content: (
											<Detail 
												ref={ref=> Model.detailScan = ref} 
												res={rowData}
											/>
										),
										btns: [
											{
												text: 'Add new product',
												callback: () => {
													this_sav.addorUpdate(this_sav, rowData, true);
												}
											},
											{
												text: 'Update product',
												callback: () => {
													this_sav.addorUpdate(this_sav, rowData, false);
												}
											},
											{
												text: 'Cancel',
												callback: () => {
													Model.objectM.dialogboxMain2.disableOverlayClickClose(false);
													Model.objectM.dialogboxMain2.close();
												}
											}
										]
									});
								}}
							>
								<Text style={[styles.detail_row,{textAlign:'right', color: 'blue'}, styles.underLine]}>
									Edit
								</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</View>
		)
	}
}

