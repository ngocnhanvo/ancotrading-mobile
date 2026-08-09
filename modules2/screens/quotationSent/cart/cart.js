import React, {
	PureComponent
} from 'react'
import {
	View,
	Dimensions,
	Image
} from 'react-native';
import {
	Button,
	Input
} from "../../../tools/native-base";
import { SwipeListView } from '../../../react-native-swipe-list-view';
import FooterLW from './footerLW.js';
import Items from './itemsCart.js';
import { BaoGiaSP } from '../../../Model/tableSQL/BaoGiaSP.js';
import { Model } from '../../../Model';
import PaginationSPD from '../../../react-native-basic-pagination/pagination.js';
import styles from '../../cart/styles.js';
import { ScrollView } from 'react-native';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

const renderItem = (item, this_sav) => {
	if(!this_sav.state.itemsQuoSentCrt)
		this_sav.state.itemsQuoSentCrt = [];
	let rowData = item.item;
	if(this_sav.state.itemsQuoSentCrt[rowData.itemNo])
		this_sav.state.itemsQuoSentCrt[rowData.itemNo].state.rowData = rowData;

	return (
		<Items 
			ref={ref => this_sav.state.itemsQuoSentCrt[rowData.itemNo] = ref}
			rowData={rowData}
		/>
	)
}

const renderHiddenItem = (item) => {
	let this_sav = Model.quotationSentCart;
	let rowData = item.item;
	return (
		<View
			key={item.index}
			style={styles.rowBack}
		>
			<Button
				full
				onPress={() => {
					Model.objectM.viewIMG(rowData.image, Model.objectM.dialogboxMain);
				}}
				style={[styles.backRightBtn, { backgroundColor: "#bcbdc0" }]}
			>
				<Image source={{ uri: `data:image/jpeg;base64,${rowData.image}` }} style={{ width: 60, height: 60 }} />
			</Button>
			<View style={{width: 70}}>
				<ScrollView>
					<Input
						style={{fontSize: 12}} 
						multiline={true}
						value={rowData.note}
						showSoftInputOnFocus={false}
					/>
				</ScrollView>
			</View>
		</View>
	)
}

export default class QuotationCart extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			BaoGiaID: props.BaoGiaID,
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
				if(Model.paginationQuoSentCrt) {
					Model.paginationQuoSentCrt.setState({dtsl: res.total}, ()=>{
						BaoGiaSP.getBaoGiaSPs({where, page: this_sav.state.pageSep, take: this_sav.state.pageNum}, (datas) => {
							this_sav.setState({dataSource: datas}, ()=>{
								if(Model.objectM.spinnerMain) {
									Model.objectM.spinnerMain.close();
								}
							});
						});
					});
				}

				if(Model.footerQuoSentLWCrt) {
					Model.footerQuoSentLWCrt.sumFooter(this_sav.state.BaoGiaID, (res1)=>{
						Model.footerQuoSentLWCrt.setState({ dtsl: res.total, sum_qty: res1.qty, sum_cbm: res1.cbm, sum_amount: res1.amount });
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
		let paginationH = (Model.paginationQuoSentCrt ? Model.paginationQuoSentCrt.state.height : 0);
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
					ListFooterComponent={() => {
						return (
							<FooterLW 
								ref={ref => Model.footerQuoSentLWCrt = ref} 
								dtsl={dtsl}
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
					ref={ref => Model.paginationQuoSentCrt = ref} 
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

