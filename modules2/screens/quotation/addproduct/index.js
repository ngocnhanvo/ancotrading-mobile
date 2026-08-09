import React, {
	Component
} from 'react'
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import {
	Icon,
	Item,
	Input,
	Button
} from "../../../tools/native-base";

import { SwipeListView } from '../../../react-native-swipe-list-view';
import styles from './styles.js';
import { Model } from '../../../Model';
import { BaoGia, BaoGiaSP, ThongTinSP } from "../../../Model/tableSQL";
import Items from './items.js';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

const renderItem = ((item, this_sav) => {
	let rowData = item.item;
	rowData.BaoGiaID = this_sav.state.BaoGiaID;
	if(!this_sav.state.itemsQuoCrtAdd)
		this_sav.state.itemsQuoCrtAdd = [];
	if(this_sav.state.itemsQuoCrtAdd[rowData.itemNo]) {
		this_sav.state.itemsQuoCrtAdd[rowData.itemNo].state.rowData = rowData;
	}

	return (
		<Items 
			ref={ref => this_sav.state.itemsQuoCrtAdd[rowData.itemNo] = ref} 
			rowData={rowData} 
		/>
	)
});

const renderHiddenItem = (item) => {
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
			<Button
				full
				onPress={() => {
					rowData.scan = true;
					let data = [];
					data.push(rowData);
					Model.objectM.sidebar.addtoCart(data);
				}}
				style={[styles.backRightBtn]}
			>
				<Icon active name="cart" style={{ fontSize: 30 }} />
			</Button>
		</View>
	)
};

//Model.quotationAddProduct
export default class QuotationAddProduct extends Component {
	constructor(props) {
		super(props);
		this.state = {
			BaoGiaID: props.BaoGiaID,
			dataSource: [],
			data_search: '',
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
			alert('Must have at least 2 characters');
			return;
		}

		Model.objectM.spinnerMain.show();
		
		const dateStr = Model.this_sav.state.dateStr;

		ThongTinSP.getThongTinSPs({dateStr, searchStr, page, take, BaoGiaID: this_sav.state.BaoGiaID}, (res) => {
			if(res.length <= 0) {
				Model.objectM.spinnerMain.close();
				Model.objectM.dialogboxMain.disableOverlayClickClose(false);
				alert('Have no records');
			}
			else {
				this_sav.setState({dataSource: res}, () => {
					if(Model.objectM.spinnerMain) {
						setTimeout(()=>{
							Model.objectM.spinnerMain.close();
						},100);
					}
				});
			}
		});
	}
	render() {
		let this_sav = this;
		let dtsSep = this_sav.state.dataSource;
		let dtsl = dtsSep.length;
		let heightH = deviceHeight * 0.6;
		let widthH = deviceWidth - 36;
		let listviewH = heightH;
		
		return (
			<View style={{ height: heightH, width: widthH, position: 'relative' }}>
				<View style={{ borderBottomWidth: 2, borderBottomColor: '#CCC' }}>
					<Item style={{ padding: 0 }}>
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
					style={{ maxHeight: listviewH }}
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
			</View>
		)
	}
}