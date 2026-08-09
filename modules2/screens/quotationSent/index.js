import React, {
    Component
} from 'react'
import {
    View,
    StyleSheet,
    Dimensions,
	Text,
	Platform,
	BackHandler
} from 'react-native'
import {
	Container,
	Icon,
	Button,
} from "../../tools/native-base";
import { SwipeListView } from '../../react-native-swipe-list-view';
import stylevnn from '../../styles/public';
import { Model } from '../../Model';
import PaginationSPD from '../../react-native-basic-pagination/pagination.js';
import HeaderSPD from './header';
import FormSPD from './form';
import FooterLW from './footerLW.js';
import Items from './items.js';
import QuotationCart from './cart/cart.js';
import { BaoGia } from '../../Model/tableSQL';
import styles from './styles.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
		this_sav.createPage(this_sav);
	}
};

const renderItem = (item, this_sav) => {
	if(!this_sav.state.itemsQuoSent)
		this_sav.state.itemsQuoSent = [];
	let rowData = item.item;
	if(this_sav.state.itemsQuoSent[rowData.BaoGiaID])
		this_sav.state.itemsQuoSent[rowData.BaoGiaID].state.rowData = rowData;

	return (
		<Items 
			ref={ref => this_sav.state.itemsQuoSent[rowData.BaoGiaID] = ref}
			rowData={rowData} 
		/>
	)
}

const renderHiddenItem = (item) => {
	let this_sav = Model.this_sav;
	let rowData = item.item;
	return (
		<View 
			key={item.index}
			style={styles.rowBack}
		>
			<Button
				full
				onPress={() => {
					this_sav.showCartInQuotation(rowData);
				}}
				style={[styles.backRightBtn, { backgroundColor: "#bcbdc0" }]}
			>
				<Icon active name="information-circle" style={{ fontSize: 30 }} />
			</Button>
			<Button
				full
				danger
				onPress={() => { this_sav.removeQuotation(rowData); }}
				style={[styles.backRightBtn]}
			>
				<Icon active name="trash" style={{ fontSize: 30 }} />
			</Button>
		</View>
	)
}

export default class QuotationSent extends Component {
    constructor(props) {
        super(props);
		this.state = {
			dataSource: [],
			user: Model.UserName,
			count_cart: 0,
			pageSep: 1,
			pageNum: 20
		};
    }
	shouldComponentUpdate() {
		return true;
	}
    render() {	
		let this_sav = this;
		let dtsl = Number(this_sav.state.dtsl);
		let dtsSep = this_sav.state.dataSource;
		let paginationH = (dtsl > this_sav.state.pageNum ? Model.paginationH : 0);
		let listviewH = deviceHeight - Model.headerH - paginationH;
		return (
			<Container ref="myRef" style={[styles.container, stylevnn.container]}>
				<HeaderSPD
					ref={ref => Model.headerQuoSent = ref} 
					props={this_sav.props} 
					count_cart={this_sav.state.count_cart} 
					dtsl={dtsl}
					display0={this_sav.state.display0}
				/>

				<FormSPD 
					ref={ref => Model.formQuoSent = ref} 
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
					keyExtractor={item => item.BaoGiaID}
					ListFooterComponent={() => {
						return (
							<FooterLW 
								ref={ref => this_sav.state.footerQuoSentLW = ref}
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
					ref={ref => Model.paginationQuoSent = ref} 
					props={this_sav.props} 
					dtsl={dtsl}
					onPageChange={(page, num)=> {
						this_sav.state.pageSep = page;
						this_sav.createPage(this_sav);
					}}
				/>
			</Container>
		)
    }
	showCartInQuotation(rowData) {
		Model.objectM.dialogboxMain2.pop({
			vnnType: 1,
			content: (
				<QuotationCart 
					ref={ref => Model.quotationSentCart = ref}
					BaoGiaID={rowData.BaoGiaID} 
				/>
			),
			btns: [
				
			]
		});
	}
	removeQuotation(rowData) {
		let this_sav = this;
		Model.objectM.dialogboxMain.pop({
			title: 'Remove this quotation',
			vnnType: 1,
			content: (
			<View>
			  <Text style={{color: '#000'}}>Do you want to remove it?</Text>
			</View>
			),
			btns: [
				{
					text: `Yes, I do`,
					callback: () => {
						BaoGia.deleteBaoGias({where: `BaoGiaID = '${rowData.BaoGiaID}'`}, () => {
							Model.objectM.dialogboxMain.close();
							this_sav.createPage(this_sav);
						});
					}
				},
				{
					text: `No, I don't`,
					callback: () => {
						Model.objectM.dialogboxMain.close();
					}
				}
			]
		});
	}
	createPage = (this_sav, hide) => {
		if(!hide)
			Model.objectM.spinnerMain.show();

		Model.objectM.sidebar.updateQuotationSentCount((a)=> {
			this_sav.state.dtsl = a;
			if(Model.paginationQuoSent)
				Model.paginationQuoSent.setState({dtsl: a});
			if(Model.headerQuoSent)
				Model.headerQuoSent.setState({dtsl: a});
		});

		let where = `status = 1 and username='${Model.UserName}'`;
		BaoGia.getBaoGias({page: this_sav.state.pageSep, take: this_sav.state.pageNum, where }, (json_data) => {
			this_sav.setState({dataSource: json_data}, () => {
				if(Model.objectM.spinnerMain) {
					setTimeout(()=>{
						Model.objectM.spinnerMain.close();
					},1000);
				}

				if(this_sav.state.footerQuoSentLW)
					this_sav.state.footerQuoSentLW.setState({dtsl: json_data.length});
			});
		});
	}
	componentDidMount() {
		let this_sav = this;
		MergeCode(this_sav);
		this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if(Model.headerQuoSent)
				Model.headerQuoSent.onBack(null, Model.headerQuoSent);
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
}