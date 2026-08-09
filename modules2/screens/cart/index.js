import React, {
	PureComponent
} from 'react'
import {
	Dimensions,
	BackHandler
} from 'react-native'
import {
	Container
} from "../../tools/native-base";
import { SwipeListView } from '../../react-native-swipe-list-view';
import { Model } from '../../Model';
import PaginationSPD from '../../react-native-basic-pagination/pagination.js';
import { GioHang } from "../../Model/tableSQL";
import HeaderSPD from "./header.js";
import FooterSPD from "./footer.js";
import Items from './items.js';
import Items2 from './items2.js';
import HeaderLW from './headerLW.js';
import FooterLW from './footerLW.js';
import FormSPD from './form.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;

		Model.objectM.sidebar.getDateCollectData((dateStr) => {
			this_sav.state.dateStr = dateStr;
		});
		
		const state = this_sav.props.navigation.state.params;
		let display0 = true;

		if(state) {
			Model.removeScreenAfterKill();
			if(state.keepAlive) {
				Model.activeSplashScreen();
				for(const key in Model.formCrt.state.mainData) {
					Model.formCrt.state[key] = state[key];
				}
				display0 = state.display0;
			}
		}

		if(Model.formCrt) {
			Model.formCrt.forceUpdate();
		}
		if(Model.headerCrt)
			Model.headerCrt.setState({display0});
		if(Model.footerCrt)
			Model.footerCrt.setState({display0});

		this_sav.createPage(this_sav);
	}
};

const renderItem = (item, this_sav) => {
	let rowData = item.item;
	rowData.dateStr = this_sav.state.dateStr;
	let id = rowData.GioHangID;
	if(!this_sav.state.itemsCrt)
		this_sav.state.itemsCrt = [];
	if(this_sav.state.itemsCrt[id]) {
		this_sav.state.itemsCrt[id].state.rowData = rowData;
	}

	return (
		<Items 
			ref={ref => this_sav.state.itemsCrt[id] = ref}
			rowData={rowData}
		/>
	)
}

const renderHiddenItem = (item, this_sav) => {
	let rowData = item.item;
	let id = rowData.GioHangID;
	if(!this_sav.state.itemsCrt2)
		this_sav.state.itemsCrt2 = [];
	if(this_sav.state.itemsCrt2[id]) {
		this_sav.state.itemsCrt2[id].state.rowData = rowData;
	}
	return (
		<Items2 
			ref={ref => this_sav.state.itemsCrt2[id] = ref}
			rowData={rowData}
		/>
	)
}

export default class Cart extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			mainData : {
				opacity: 1,
				status: true,
				dataSource: [],
				selected1: "",
				display0: true,
				user: Model.UserName,
				count_cart: 0,
				heightViewHeader: 0,
				heightViewFooter: 0,
				pageSep: 1,
				pageNum: 20,
				dtsl: 0,
				sum_qty: 0,
				sum_cbm: 0,
				sum_amount: 0
			}
		};
		for (const key in this.state.mainData) {
			this.state[key] = this.state.mainData[key];
		}
	}
	countCart = (a) => {
		if(Model.paginationCrt)
			Model.paginationCrt.setState({dtsl: a});
		if(Model.footerCrt)
			Model.footerCrt.setState({dtsl: a});
		if(Model.headerCrt)
			Model.headerCrt.setState({count_cart: a});
	}
	createPage = (this_sav, hide) => {
		if(!hide)
			Model.objectM.spinnerMain.show();
	
		Model.objectM.sidebar.updateCount((a)=> {
			this_sav.state.count_cart = a;
			this_sav.countCart(a);
		});

		GioHang.getGioHangs({page: this_sav.state.pageSep, take: this_sav.state.pageNum }, (json_data) => {
			this_sav.setState({dataSource: json_data, opacity: 0}, () => {
				if(Model.objectM.spinnerMain) {
					if(this_sav.state.footerCrtLW) {
						this_sav.state.footerCrtLW.sumFooter((res)=> {
							this_sav.state.footerCrtLW.setState({ dtsl: res.qty, sum_qty: res.qty, sum_cbm: res.cbm, sum_amount: res.amount }, ()=>{
								Model.objectM.spinnerMain.close();
							});
						});
					}
				}
			});
		});
	}
	
	componentDidMount() {
		let this_sav = this;
		MergeCode(this_sav);
		this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if(Model.headerCrt)
				Model.headerCrt.onBack(Model.headerCrt);
			else
				this_sav.props.navigation.goBack();
			return true;
		});
	}
	UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = this_sav.props.navigation.addListener(
			'willFocus', () => {
				MergeCode(this_sav, true);
			}
		);
	}
	componentWillUnmount() {
		this.backHandler.remove();
		this.willFocusSubscription.remove();
	}
	render() {
		let this_sav = this;
		let dtsl = Number(this_sav.state.count_cart);
		let dtsSep = this_sav.state.dataSource;
		let headerH = Model.headerH;
		let footerH = Model.footerH;
		let paginationH = (dtsl > this_sav.state.pageNum ? Model.paginationH : 0);
		let listviewH = deviceHeight - headerH - footerH - paginationH;
		return (
			<Container ref="myRef">
				<HeaderSPD
					ref={ref => Model.headerCrt = ref} 
					props={this_sav.props} 
					count_cart={this_sav.state.count_cart} 
					dtsl={dtsl}
					display0={this_sav.state.display0}
				/>
				
				<FormSPD 
					ref={ref => Model.formCrt = ref} 
					props={this_sav.props}
					display0={this_sav.state.display0}
				/>
				
				<SwipeListView
					onLayout={(event)=> {
					}}
					style={{ maxHeight: listviewH }}
					getItemLayout={(data, index) => (
						{ length: 80, offset: 80 * index, index }
					)}
					//initialNumToRender={10}
					data={dtsSep}
					keyExtractor={item => item.GioHangID}
					stickyHeaderIndices={[0]} 
					ListHeaderComponent={() => (
						<HeaderLW />
					)}
					ListFooterComponent={() => {
						return (
							<FooterLW 
								ref={ref => this_sav.state.footerCrtLW = ref}
							/>
						)
					}}
					renderItem={(item)=>{
						return renderItem(item, this_sav);
					}}
					renderHiddenItem={(item)=>{
						return renderHiddenItem(item, this_sav);
					}}
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
					ref={ref => Model.paginationCrt = ref} 
					props={this_sav.props} 
					dtsl={dtsl}
					onPageChange={(page, num)=> {
						this_sav.state.pageSep = page;
						this_sav.createPage(this_sav);
					}}
				/>

				<FooterSPD 
					ref={ref => Model.footerCrt = ref} 
					props={this_sav.props}
					dtsl={dtsl} 
					display0={this_sav.state.display0}
				/>
			</Container>
		)
	}
}

