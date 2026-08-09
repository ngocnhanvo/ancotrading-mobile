import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import styles from './styles.js';
import { Model } from '../../../Model';
import Clipboard from '@react-native-clipboard/clipboard';
import { ThongTinSP } from "../../../Model/tableSQL/ThongTinSP.js";
import Detail from '../../scan/detail.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class Items extends Component {
	constructor(props) {
        super(props)
        this.state = {
            rowData: {...props.rowData},
			opacity: 1
        }
        this.ref = null
    }
	addorUpdate = (this_sav, rowData, type) => {
		let res = Model.detailScan.state.res;
		let itemSel = res.itemNo;
		let qty = Model.detailScan.state.qty;
		let note = Model.detailScan.state.note;
		
		
		if(!qty)
			qty = 1;
		
		if(qty < Model.minVal) {
			alert(`The quantity must be greater than "${Model.minVal - 1}"`);
			return;
		}
		if(qty > Model.maxVal) {
			alert(`The quantity must be fewer than "${Model.maxVal + 1}"`);
			return;
		}

		let selCL = rowData.itemNo != itemSel;

		if(selCL | rowData.qty != qty | rowData.note != note) {
			ThongTinSP.getThongTinSPs({searchStr: itemSel, dateStr: rowData.dateStr, page: 1, take: 1}, (datas) => {
				if(datas.length <= 0) {
					alert(`"${itemSel}" doesn't exist in the "Search Product" menu`);
				}
				else {
					//datas[0].BaoGiaSPID = rowData.BaoGiaSPID;
					datas[0].BaoGiaID = rowData.BaoGiaID;
					datas[0].scan = false;
					datas[0].selCL = selCL;
					datas[0].qty = qty;
					datas[0].note = note;
					datas[0].itemNo_old = type ? "000000000" : rowData.itemNo;
					datas[0].index = rowData.index;
					datas[0].sizes = res.sizes;
					datas[0].colors = res.colors;
					Model.objectM.sidebar.addtoQuotationCart(datas, (msg) => {
						if(msg) {
							alert(msg);
							Model.objectM.spinnerMain.close();
						}
						else {
							Model.objectM.dialogboxMain4.disableOverlayClickClose(false);
							Model.objectM.dialogboxMain4.close();
							const page = Model.quotationAddProduct.state.pageStep, 
								take = Model.quotationAddProduct.state.pageNum;
							Model.quotationAddProduct.searchP(page, take);
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
					<View style={{ flexDirection: 'column', height: 100, padding: 5 }}>
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
							<Text style={[styles.detail_row, {textAlign: 'right'}]}></Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}></Text>
							<Text style={[styles.detail_row, {flex: 1}]}>{rowData.palletSize}</Text>
							<Text style={[styles.detail_row, {textAlign: 'right'}]}></Text>
						</View>
						<View style={{ flexDirection: 'row' }}>
							<Text style={[styles.detail_row, {width: 25}]}></Text>
							<Text style={[styles.detail_row, {flex: 1}]}>CBM: {rowData.cbm}</Text>
							<TouchableOpacity 
								style={{textAlign: 'right', width: 150, display: rowData.addtoquotation == 1 ? 'none' : ''}} 
								onPress={() => {
									rowData.dateStr = Model.this_sav.state.dateStr;
									Model.objectM.dialogboxMain4.disableOverlayClickClose(true);
									Model.objectM.dialogboxMain4.pop({
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
												text: 'Cancel',
												callback: () => {
													Model.objectM.dialogboxMain4.disableOverlayClickClose(false);
													Model.objectM.dialogboxMain4.close();
												}
											}
										]
									});
								}}
							>
								<Text style={[styles.detail_row,{textAlign:'right', color: 'blue'}, styles.underLine]}>
									Add to quotation
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		)
    }
}