import React, {
	PureComponent
} from 'react'
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	BackHandler,
	Dimensions
} from 'react-native'
import {
	Container,
	Icon,
	Item,
	Input,
	Button
} from "../../tools/native-base";

import { SwipeListView } from '../../react-native-swipe-list-view';
import stylevnn from '../../styles/public.js';
import styles from './styles.js';
import { Model } from '../../Model';
import PaginationSPD from '../../react-native-basic-pagination/pagination.js';
import { ThongTinSP } from "../../Model/tableSQL";
import Items from './items.js';
import HeaderSPD from "./header.js";

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;
const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
		Model.objectM.sidebar.updateCount((count_cart)=>{
			count_cart = Model.objectM.countCart(count_cart);
			Model.headerSPD.setState({count_cart});
			this_sav.searchP(this_sav.state.pageSep, this_sav.state.pageNum);
		});
	}
};

const renderItem = ((item, this_sav) => {
	let rowData = item.item;
	if(!this_sav.state.itemsSPD)
		this_sav.state.itemsSPD = [];
	if(this_sav.state.itemsSPD[rowData.itemNo]) {
		this_sav.state.itemsSPD[rowData.itemNo].state.rowData = rowData;
	}

	return (
		<Items
			ref={ref => this_sav.state.itemsSPD[rowData.itemNo] = ref}
			rowData={rowData}
		/>
	)
});

const renderHiddenItem = (item) => {
	let rowData = item.item;
	return (
		<View
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
			<Button
				full
				onPress={() => {
					rowData.scan = true;
					let data = [rowData];
					Model.objectM.sidebar.addtoCart(data);
				}}
				style={[styles.backRightBtn]}
			>
				<Icon active name="cart" style={{ fontSize: 30 }} />
			</Button>
		</View>
	)
};

export default class SearchProduct extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			status: true,
			goback: "Home",
			selected1: "",
			display0: true,
			display1: false,
			user: Model.UserName,
			scroll_lst: 0,
			activeScan: 0,
			data_search: '',
			data_dt: '',
			data: '',
			pageSep: 1,
			pageNum: 20,
			dtsl: 0
		};
	}
	searchP(page, take) {
		let this_sav = this;
		let searchStr = this_sav.state.data_search;
		if(searchStr.length < 2) {
			Model.objectM.spinnerMain.close();
			Model.objectM.dialogboxMain.alert('Must have at least 2 characters');
			return;
		}

		Model.objectM.spinnerMain.show();
		Model.objectM.sidebar.getDateCollectData((dateStr) => {
			let where = `dateStr = '${dateStr}' and itemNo like '%${searchStr}%'`;
			ThongTinSP.countThongTinSPs({where}, (res)=> {
				this_sav.state.dtsl = res.total;
				Model.headerSPD.setState({dtsl: res.total});
				if(Model.paginationSPD) {
					Model.paginationSPD.setState({dtsl: res.total});
				}
			});

			ThongTinSP.getThongTinSPs({dateStr, searchStr, page, take}, (res) => {
				this_sav.setState({dataSource: res}, () => {
					if(Model.objectM.spinnerMain) {
						setTimeout(()=>{
							Model.objectM.spinnerMain.close();
						},100);
					}
				});
				Model.headerSPD.setState({dts: res.length});
			});
		});
	}
	render() {
		let this_sav = this;
		let dtsl = Number(this_sav.state.dtsl);
		let dtsSep = this_sav.state.dataSource;
		
		return (
			<Container ref="myRef" style={[styles.container, stylevnn.container]}>
				<HeaderSPD 
					ref={ref => Model.headerSPD = ref} 
					props={this_sav.props}  
					dtsl={dtsl} 
					dts={dtsSep.length} 
				/>
				<View style={{ flex: 1 }}>
					<View style={{ borderBottomWidth: 2, borderBottomColor: '#CCC', backgroundColor: '#fafafb' }}>
						<Item style={{ padding: 5 }}>
							<Input
								value={this_sav.state.data_search}
								onChangeText={(text) => { this_sav.setState({data_search: text}); }}
								placeholder="Type product code"
							/>
							<TouchableOpacity onPress={() => { this_sav.searchP(this_sav.state.pageSep, this_sav.state.pageNum); }}>
								<Icon active name="search" style={{backgroundColor:'#000', color: '#FFF', paddingLeft: 10, paddingTop: 7, paddingBottom: 7 }} />
							</TouchableOpacity>
						</Item>
					</View>
					
					<SwipeListView
						getItemLayout={(data, index) => (
							{ length: 80, offset: 80 * index, index }
						)}
						ListFooterComponent={() => {
							return dtsl <= 0 ? (
								<View style={{ marginVertical: 5, padding: 10, backgroundColor: '#FFFFFF', alignItems: 'center' }}>
									<Text style={{ color: '#7f7d7d', fontSize: 16 }}>Have no records</Text>
								</View>
							) : null
						}}
						data={dtsSep}
						keyExtractor={item => item.itemNo}
						ref={r=>this.refs=r}
						//initialNumToRender={5}
						//maxToRenderPerBatch={10}
						renderItem={(item)=>{
							return renderItem(item, this_sav);
						}}
						renderHiddenItem={renderHiddenItem}
						disableLeftSwipe={true}
						disableRightSwipe={false}
						leftOpenValue={75}
						rightOpenValue={-75}
						previewRowKey={'0'}
						previewOpenValue={-40}
						previewOpenDelay={3000}
					/>

					<PaginationSPD
						ref={ref => Model.paginationSPD = ref} 
						props={this_sav.props} 
						dtsl={dtsl}
						onPageChange={(page, num)=> {
							this_sav.state.pageSep = page;
							this_sav.searchP(page, num);
						}}
					/>
				</View>
			</Container>
		)
	}
	componentDidMount() {
		let this_sav = this;
		let itemNo = this_sav.props.navigation.state.params.data;
		let itemNo_09 = itemNo.substring(0, 9);
		let itemNo_12 = itemNo.substring(11);
		itemNo = itemNo_09 + '__' + itemNo_12;
		this_sav.setState({data_search: itemNo});
		MergeCode(this_sav);
		
		this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if(Model.headerSPD)
				Model.headerSPD.onBack(Model.headerSPD);
			else
				this_sav.props.navigation.goBack();
			return true;
		});
	}
	componentWillUnmount() {
		if(this.backHandler)
			this.backHandler.remove();
		if(this.willFocusSubscription)
			this.willFocusSubscription.remove();
	}
	UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = this_sav.props.navigation.addListener(
			'willFocus', () => {
				MergeCode(this_sav , true);
			}
		);
	}
}