import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { SwipeListView } from '../../../react-native-swipe-list-view';
import FooterLW from './footerLW.js';
import Items from './itemsCart.js';
import Items2 from './itemsCart2.js';
import { BaoGiaSP } from '../../../Model/tableSQL/BaoGiaSP.js';
import { Model } from '../../../Model';
import PaginationSPD from '../../../react-native-basic-pagination/pagination.js';
import PrintMain from './print.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

const renderItem = (item, this_sav) => {
	let rowData = item.item;
	let id = rowData.BaoGiaSPID;
	if(!Model.itemsQuoCrt)
		Model.itemsQuoCrt = [];
	if(Model.itemsQuoCrt[id]) {
		Model.itemsQuoCrt[id].state.rowData = rowData;
	}

	return (
		<Items 
			ref={ref => Model.itemsQuoCrt[id] = ref}
			rowData={rowData}
		/>
	)
}

const renderHiddenItem = (item) => {
	let rowData = item.item;
	let id = rowData.BaoGiaSPID;
	if(!Model.itemsQuoCrt2)
		Model.itemsQuoCrt2 = [];
	if(Model.itemsQuoCrt2[id]) {
		Model.itemsQuoCrt2[id].state.rowData = rowData;
	}
	return (
		<Items2 
			ref={ref => Model.itemsQuoCrt2[id] = ref}
			rowData={rowData}
		/>
	)
}

export default class QuotationCart extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			BaoGiaID: props.BaoGiaID,
			partner: props.partner,
			pageNum: 20,
			pageSep: 1,
			dataSource: []
		};
		this.createPage(this);
	}
	createPage(this_sav) {
		Model.objectM.spinnerMain.show();
		let where = `BaoGiaID = '${this_sav.state.BaoGiaID}'`;
		BaoGiaSP.countBaoGiaSPs({where}, (res) => {
			if(res) {
				if(Model.paginationQuoCrt) {
					Model.paginationQuoCrt.setState({dtsl: res.total}, ()=>{
						BaoGiaSP.getBaoGiaSPs({where, page: this_sav.state.pageSep, take: this_sav.state.pageNum}, (datas) => {
							this_sav.setState({dataSource: datas}, ()=>{
								if(Model.objectM.spinnerMain) {
									Model.objectM.spinnerMain.close();
								}
							});
						});
					});
				}

				if(Model.footerQuoLWCrt) {
					Model.footerQuoLWCrt.sumFooter(this_sav.state.BaoGiaID, (res1)=>{
						Model.footerQuoLWCrt.setState({ dtsl: res.total, sum_qty: res1.qty, sum_cbm: res1.cbm, sum_amount: res1.amount });
					});
				}
			}
		});
	}
	render() {
		let this_sav = this;
		let dtsl = this_sav.state.dtsl;
		let dtsSep = this_sav.state.dataSource;
		let heightH = deviceHeight * 0.6;
		let widthH = deviceWidth * 0.95;
		let paginationH = (Model.paginationQuoCrt ? Model.paginationQuoCrt.state.height : 0);
		paginationH = paginationH ? paginationH : 0;
		let listviewH = heightH - paginationH;
		return (
			<View style={{ height: heightH, width: widthH }}>
				<SwipeListView
					onLayout={(event)=> {
					}}
					getItemLayout={(data, index) => (
						{ length: 80, offset: 80 * index, index }
					)}
					//initialNumToRender={10}
					data={dtsSep}
					keyExtractor={item => item.itemNo}
					ListHeaderComponent={() => (
						<TouchableOpacity 
							onPress={() => {
								Model.objectM.dialogboxMain3.pop({
									vnnType: 1,
									title: ``,
									content: (
										<View style={{width:deviceWidth, height: deviceHeight - deviceHeight/4}}>
											<PrintMain 
												BaoGiaID={this_sav.state.BaoGiaID}
												partner={this_sav.state.partner}
											/>
										</View>
									),
									btns: [
										{
											text: 'Cancel',
											callback: () => {
												Model.objectM.dialogboxMain3.close();
											}
										}
									]
								});
							}}
						>
							<View style={{alignItems: 'center'}}>
								<Text style={{
									color:'blue', 
									textDecorationLine: "underline",
									textDecorationStyle: "solid",
									textDecorationColor: "#000"
								}}>Show print page</Text>
							</View>
						</TouchableOpacity>
					)}
					ListFooterComponent={() => {
						return (
							<FooterLW 
								ref={ref => Model.footerQuoLWCrt = ref}
							/>
						)
					}}
					renderItem={(item)=>{
						return renderItem(item, this_sav);
					}}
					renderHiddenItem={renderHiddenItem}
					disableLeftSwipe={false}
					disableRightSwipe={false}
					leftOpenValue={75}
					rightOpenValue={-75}
					previewRowKey={'0'}
					previewOpenValue={-40}
					previewOpenDelay={3000}
					onSwipeValueChange={(swipeData) => {

					}}
				/>

				<PaginationSPD
					ref={ref => Model.paginationQuoCrt = ref} 
					props={this_sav.props} 
					dtsl={dtsl}
					onPageChange={(page, num)=> {
						this_sav.state.pageSep = page;
						this_sav.createPage(this_sav);
					}}
				/>
			</View>
		)
	}
}

