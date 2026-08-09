import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import { FooterNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';
import { BaoGia, BaoGiaSP } from '../../Model/tableSQL';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FooterSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: props.count_cart,
			activeScan: props.activeScan,
			props: {...props.props}
        }
        this.ref = null
    }
	QOPOexcuteComplete(result) {
		if (result.Success == false) {
			Model.this_sav.createPage(Model.this_sav, true);
			Model.objectM.spinnerMain.close();
			Model.objectM.dialogboxMain.alert(result.Message);
		}
		else {
			let qos = Model.this_sav.state.dataSource;
			if(qos.length > 0) {
				qos = qos.filter((a)=>{
					return a.checked == true;
				});
			}

			if(qos.length <= 0) {
				Model.objectM.spinnerMain.close();
				alert(`Have no selected quotation`);
				return;
			}

			let dataU = [];
			if(result.BaoGiaID)
				dataU.push({onlyStatus: true, status: 1, username: Model.UserName, BaoGiaID: result.BaoGiaID});
			BaoGia.updateBaoGias(dataU, (rsU) => {
				if(rsU) {
					if(rsU.rowsAffected > 0) {
						let rowDT = Model.this_sav.state.dataSource.filter((a)=>{return a.BaoGiaID == result.BaoGiaID})[0];
						rowDT.status = true;
						if(Model.itemsQuo) {
							if(Model.itemsQuo[rowDT.BaoGiaID])
								Model.itemsQuo[rowDT.BaoGiaID].setState({rowData: rowDT});
						}
					}
				}

				const qoIDs = qos.map(obj => obj.BaoGiaID);
				let where = `status = 0 and BaoGiaID in ('${qoIDs.join("','")}')`;
				BaoGia.getBaoGias({where, take: 1}, (datas) => {
					if(datas.length > 0) {
						let rowEle = datas[0];
						rowEle.username = Model.UserName;
						where = `BaoGiaID = ${rowEle.BaoGiaID}`;
						BaoGiaSP.getBaoGiaSPs({where}, (sps)=> {
							let len = sps.length;
							if(len > 0) {
								let spsInQuo = [];
								for(let i=0; i<len; i++) {
									spsInQuo.push({
										ma_sanpham: sps[i].itemNo,
										price: sps[i].price,
										soluong: sps[i].qty,
										ghichu: sps[i].note
									});
								}
								rowEle.json_data = spsInQuo;
								rowEle.count = result.Count;
								Model.execSignalR('CreateQO', rowEle, (result) => {
									if (result != '') {
										Model.objectM.spinnerMain.close();
										alert(result);
									}
								});
							}
							else {
								Model.objectM.spinnerMain.close();
								Model.objectM.dialogboxMain.alert(`There are no products listed in this quotation`);
							}
						});
					}
					else if(result.Count <= 0) {
						Model.objectM.spinnerMain.close();
						Model.objectM.dialogboxMain.alert(`There are no quotations`);
					}
					else {
						Model.objectM.spinnerMain.close();
						Model.this_sav.createPage(Model.this_sav, true);
						Model.objectM.dialogboxMain.disableOverlayClickClose(true);
						let txtQ = result.Count > 1 ? "quotations": "quotation";
						Model.objectM.dialogboxMain.pop({
							title: `${result.Count} ${txtQ} have been sent`,
							vnnType: 1,
							content: (
								<View>
									<Text style={{color: '#000'}}>Go to the "Sent Quotations" menu</Text>
								</View>
							),
							btns: [
								{
									text: `OK`,
									callback: () => {
										Model.objectM.dialogboxMain.disableOverlayClickClose(false);
										Model.objectM.dialogboxMain.close();
										Model.this_sav.props.navigation.navigate("QuotationSent");
									}
								},
								{
									text: `Cancel`,
									callback: () => {
										Model.objectM.dialogboxMain.disableOverlayClickClose(false);
										Model.objectM.dialogboxMain.close();
									}
								}
							]
						});
					}
				});
			});			
		}
	}
	render() {
		let this_sav = this;
		let display0 = Model.formQuo ? Model.formQuo.state.display0 : true;
		return(
			<FooterNTBVNN
				ref={ ref => Model.footerMainQuo = ref }
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				childs={
					<TouchableOpacity 
						style={[
							stylevnn.btnFooter,
							{
								flex: 1
							}
						]} 
						onPress={() => {
							Model.objectM.screen = Model.this_sav;
							if(display0) {
								Model.objectM.sidebar.getUser((nhanvien)=> {
									if(nhanvien.status) {
										Model.objectM.dialogboxMain.disableOverlayClickClose(true);
										Model.objectM.dialogboxMain.pop({
											title: 'Confirm your account',
											vnnType: 1,
											content: (
												<View>
													<Text style={{color: '#000'}}>Account: {nhanvien.user}</Text>
												</View>
											),
											btns: [
												{
													text: `OK, send the quotations to the server`,
													callback: () => {
														Model.objectM.spinnerMain.show();
														this_sav.QOPOexcuteComplete({
															Success: true,
															Count: 0
														});
														Model.objectM.dialogboxMain.disableOverlayClickClose(false);
														Model.objectM.dialogboxMain.close();
													}
												},
												{
													text: `No, go to the "Login" page`,
													callback: () => {
														Model.objectM.dialogboxMain.disableOverlayClickClose(false);
														Model.objectM.dialogboxMain.close();
														Model.this_sav.props.navigation.navigate("Login", { data: ''});
													}
												},
												{
													text: 'Cancel',
													callback: () => {
														Model.objectM.dialogboxMain.disableOverlayClickClose(false);
														Model.objectM.dialogboxMain.close();
													}
												}
											]
										});
									}
									else {
										Model.objectM.dialogboxMain.disableOverlayClickClose(true);
										Model.objectM.dialogboxMain.pop({
											title: 'You are not logged in',
											vnnType: 1,
											content: (
												<View>
													<Text style={{color: '#000'}}>Go to the "Login" page</Text>
												</View>
											),
											btns: [
												{
													text: 'OK',
													callback: () => {
														Model.objectM.dialogboxMain.disableOverlayClickClose(false);
														Model.objectM.dialogboxMain.close();
														Model.this_sav.props.navigation.navigate("Login", { data: ''});
													}
												}
											]
										});
									}
								});
							}
							else {
								Model.objectM.dialogboxMain.disableOverlayClickClose(true);
								Model.objectM.dialogboxMain.pop({
									title: 'Update Information',
									vnnType: 1,
									content: (
										<View>
											<Text style={{color:'#000'}}>Confirm your action!!!</Text>
										</View>
									),
									btns: [
										{
											text: 'OK',
											callback: () => {
												let rows = [{
													BaoGiaID: Model.formQuo.state.BaoGiaID,
													date: Model.formQuo.state.date,
													ma_dtkd: Model.formQuo.state.ma_dtkd,
													ten_dtkd: Model.formQuo.state.ten_dtkd,
													nguoilienhe: Model.formQuo.state.nguoilienhe,
													phone: Model.formQuo.state.phone,
													email: Model.formQuo.state.email,
													address: Model.formQuo.state.address,
													note: Model.formQuo.state.note,
													note2: Model.formQuo.state.note2,
													status: Model.formQuo.state.status,
													qotype: Model.formQuo.state.qotype
												}];
												BaoGia.updateBaoGias(rows, () => {
													Model.formQuo.setState({display0: true}, ()=>{
														Model.headerQuo.forceUpdate();
														Model.footerQuo.forceUpdate();
														if(Model.this_sav.state.itemsQuo) {
															if(Model.this_sav.state.itemsQuo[rows[0].BaoGiaID]) {
																Model.this_sav.state.itemsQuo[rows[0].BaoGiaID].setState({
																	rowData: rows[0]	
																});
															}
														}
													});
													Model.objectM.dialogboxMain.disableOverlayClickClose(false);
													Model.objectM.dialogboxMain.close();
												});
											}
										},
										{
											text: 'Cancel',
											callback: () => {
												Model.objectM.dialogboxMain.disableOverlayClickClose(false);
												Model.objectM.dialogboxMain.close();
											}
										}
									]
								});
							}
						}}
					>
						<Text style={[stylevnn.txtBtnFooter]}>
							{display0 ? `Send to "${Model.NameIp()}"` : `Update Information`}
						</Text>
					</TouchableOpacity>
				}
			/>
		)
    }
}