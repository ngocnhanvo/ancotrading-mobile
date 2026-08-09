import React, { PureComponent } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import { FooterNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';
import { GioHang, BaoGia, BaoGiaSP } from "../../Model/tableSQL";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
export default class FooterSPD extends PureComponent {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: props.count_cart,
			dtsl: props.dtsl,
			props: {...props.props},
			ma_dtkd: "",
			ten_dtkd: "",
			nguoilienhe: "",
			note: "",
			note2: "",
			email: "",
			address: "",
			phone: "",
			qotype: 0
        };
		this.onChange(this);
        this.ref = null
    }
	onChange = (this_sav) => {
        if(Model.formCrt) {
			this_sav.state.ma_dtkd = Model.formCrt.state.ma_dtkd;
			this_sav.state.ten_dtkd = Model.formCrt.state.ten_dtkd;
			this_sav.state.nguoilienhe = Model.formCrt.state.nguoilienhe;
			this_sav.state.note = Model.formCrt.state.note;
			this_sav.state.note2 = Model.formCrt.state.note2;
			this_sav.state.email = Model.formCrt.state.email;
			this_sav.state.address = Model.formCrt.state.address;
			this_sav.state.phone = Model.formCrt.state.phone;
			this_sav.state.qotype = Model.formCrt.state.qotype;
		}
    }
	checkData = (this_sav) => {
		if(this_sav.state.dtsl.length <= 0) {
			Model.objectM.dialogboxMain.alert("Have no products");
			return false;
		}

		if(isNaN(this_sav.state.qotype)) {
			Model.objectM.dialogboxMain.alert(`"QO Type" is incorrect`);
			return false;
		}

		if(this_sav.state.ten_dtkd.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Company Name" is incorrect`);
			return false;
		}

		if(this_sav.state.ma_dtkd.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Customer Code" is incorrect`);
			return false;
		}

		if(this_sav.state.nguoilienhe.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Person Contact" is incorrect`);
			return false;
		}

		if(this_sav.state.phone.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Phone" is incorrect`);
			return false;
		}

		if(this_sav.state.email.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Email" is incorrect`);
			return false;
		}

		if(this_sav.state.address.replace(/ /g, '').length <= 0) {
			Model.objectM.dialogboxMain.alert(`"Address" is incorrect`);
			return false;
		}

		return {
			ma_dtkd: this_sav.state.ma_dtkd,
			ten_dtkd: this_sav.state.ten_dtkd,
			email: this_sav.state.email,
			address: this_sav.state.address,
			qotype: this_sav.state.qotype
		};
	}
	render() {
		let this_sav = this;
		let dtsl = this_sav.state.dtsl;
		return(
			<FooterNTBVNN
				ref={ref => Model.footerMainCrt = ref}
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				childs={
					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, flexDirection: 'row' }}>
							<TouchableOpacity style={[
								stylevnn.btnFooter,
								{
									flex: 1
									, backgroundColor: "rgb(148,194,71)"
								}
							]} onPress={() => {
								this_sav.onChange(this_sav);
								if(dtsl <= 0)
								{
									Model.objectM.dialogboxMain.alert("Have no products");
								}
								else if(Model.formCrt.state.display0) {
									Model.headerCrt.setState({display0: false});
									Model.formCrt.setState({display0: false});
									this_sav.forceUpdate();
								}
								else {
									if(!this_sav.checkData(this_sav))
										return;

									Model.objectM.dialogboxMain.disableOverlayClickClose(true);
									Model.objectM.dialogboxMain.pop({
										title: 'Create Quotation',
										vnnType: 1,
										content: (
										<View>
										<Text style={{color: '#000'}}>Confirm your action!!!</Text>
										</View>
										),
										btns: [
										{
											text: 'OK',
											callback: () => {
												Model.objectM.dialogboxMain.disableOverlayClickClose(false);
												Model.objectM.spinnerMain.show();
												GioHang.getGioHangs(null, (json_data) => {
													
													if(json_data.length <= 0)
													{
														Model.objectM.spinnerMain.close();
														Model.objectM.dialogboxMain.alert("Have no products");
														return;
													}

													const afterModifyBG = (rs) => {
														let len = json_data.length;
														for(let i = 0; i < len; i++) {
															let row = json_data[i];
															row.BaoGiaID = rs.insertId;
															BaoGiaSP.deleteBaoGiaSPs({where: `BaoGiaID = ${row.BaoGiaID} and itemNo = '${row.itemNo}'`}, ()=> {
																if(i == len - 1) {
																	BaoGiaSP.insertBaoGiaSPs(json_data, () => {
																		GioHang.deleteGioHangs(null, () => {
																			Model.objectM.sidebar.updateCount((a)=> {
																				if(Model.objectM.spinnerMain)
																					Model.objectM.spinnerMain.close();
			
																				
																				Model.objectM.sidebar.updateQuotationCount((a1)=> {
																					Model.objectM.dialogboxMain.disableOverlayClickClose(true);
																					Model.objectM.dialogboxMain.pop({
																						title: 'Created successfully',
																						vnnType: 1,
																						content: (
																						<View>
																						<Text style={{color: '#000'}}>Go to the "Pending Quotations" menu</Text>
																						</View>
																						),
																						btns: [
																						{
																							text: 'OK',
																							callback: () => {
																								Model.objectM.dialogboxMain.disableOverlayClickClose(false);
																								Model.objectM.dialogboxMain.close();
																								Model.this_sav.props.navigation.navigate("Quotation");
																							}
																						}
																						]
																					});
			
																					this_sav.setState({count_cart: a, count_quotation: a1});
																				});
																			});
																		});
																	});
																}
															});
														}
													};
													
													BaoGia.getBaoGias({where: `ma_dtkd='${this_sav.state.ma_dtkd}' and status = 0`, take: 1}, (rows) => {
														if(rows.length > 0) {
															Model.objectM.spinnerMain.close();
															alert(`A quotation for customer "${this_sav.state.ma_dtkd}" already exists`);
															// let row = rows[0];
															// row.ten_dtkd = this_sav.state.ten_dtkd;
															// row.username = this_sav.state.user;
															// row.date =  new Date(),
															// row.nguoilienhe = this_sav.state.nguoilienhe;
															// row.email = this_sav.state.email;
															// row.phone = this_sav.state.phone;
															// row.address = this_sav.state.address;
															// row.note = this_sav.state.note;
															// row.note2 = this_sav.state.note2;
															// BaoGia.updateBaoGias(rows, (rs) => {
															// 	rs.insertId = row.BaoGiaID;
															// 	afterModifyBG(rs);
															// });
														}
														else {
															rows.push({
																ma_dtkd: this_sav.state.ma_dtkd,
																ten_dtkd : this_sav.state.ten_dtkd,
																username : this_sav.state.user,
																date : new Date(),
																nguoilienhe : this_sav.state.nguoilienhe,
																email : this_sav.state.email,
																phone : this_sav.state.phone,
																address : this_sav.state.address,
																note : this_sav.state.note,
																note2 : this_sav.state.note2,
																status: 0,
																qotype: this_sav.state.qotype
															});
															BaoGia.insertBaoGias(rows, (rs) => {
																afterModifyBG(rs);
															});
														}
													});
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
							}}>
								<Text style={[stylevnn.txtBtnFooter]}>
									{Model.formCrt ? (Model.formCrt.state.display0 ? "Create Quotation" : "Confirm to Create QO") : "Create Quotation"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				}
			/>
		)
    }
}