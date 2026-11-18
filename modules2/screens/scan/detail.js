import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Image,
	KeyboardAvoidingView
} from 'react-native'
import {
	Item,
	Input,
	Label
} from "../../tools/native-base";
import Clipboard from '@react-native-clipboard/clipboard';
import NumericInput from '../../react-native-numeric-input';
import { Model } from "../../Model";
import { getTotalQuantity, getLineAmount } from '../../Model/quantity';
import { Dimensions } from 'react-native';
import styles from './styles.js';
import { ScrollView } from 'react-native';
import Colors from './colors.js';
import Sizes from './sizes.js';
import Sets from './sets.js';
import { ThongTinSP } from '../../Model/tableSQL/ThongTinSP.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

class Detail extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			res: {...props.res},
			load: false
		};

		this.state.qty = this.state.res.qty == null ? 1 : Number(this.state.res.qty);
		this.state.qtyPallet = Math.max(0, Math.floor(Number(this.state.res.qtyPallet) || 0));
		this.state.note = this.state.res.note ? this.state.res.note : '';
	}
	componentDidMount() {
		let this_sav = this;
		let res = this_sav.state.res, arr = [];
		let where = '';
		res.sizes.map(function(obj) {
			arr.push(obj.itemNo);
		});
		res.colors.map(function(obj) {
			arr.push(obj.itemNo);
		});
		where += `and t1.itemNo in ('${arr.join("','")}')`;
		ThongTinSP.getThongTinSPs({dateStr: res.dateStr, where}, (datas) => {
			
			res = Model.getColorsAndSizes(datas, res);
			
			this_sav.setState({load:true});
		});
	}
	render() {
		let this_sav = this;
		let res = this_sav.state.res;
		const sizeSets = Model.getSizeSets(res.sizes);
		let sizes = sizeSets.sizes.filter((s)=>{ return s.image != null });
		let sets = sizeSets.sets.filter((s)=>{ return s.image != null | s.type == 0 });
		let colors = res.colors.filter((s)=>{ return s.image != null });
		let maxHeight = deviceHeight - deviceHeight/4;
		const isTabletLayout = deviceWidth >= 600;
		const quantityWidth = isTabletLayout ? 280 : Math.min(280, deviceWidth - 90);
		const quantityRow = {qty: this_sav.state.qty, qtyPallet: this_sav.state.qtyPallet, slOuter: res.slOuter, price: res.price};
		const totalQty = getTotalQuantity(quantityRow);
		const lineAmount = getLineAmount(quantityRow);
		return (
			!this_sav.state.load ? 
				<View style={{width:'100%', maxHeight }}><Text style={{color:'#000'}}>Loading...</Text></View> :
					<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
					<View style={{width:'100%', maxHeight }}>
						<Model.ScrollView>
							<View style={{flexDirection: 'row', width:'100%', alignItems: 'center', justifyContent: 'center'}}>
								<TouchableOpacity onPress={() => { Model.objectM.viewIMG(res.image, Model.objectM.dialogboxMain); }}>
									<Image source={{ uri: `data:image/jpeg;base64,${res.image}` }} style={{ width: 250, height: 250 }} />
								</TouchableOpacity>
							</View>
							<View style={{flexDirection: 'row', width:'100%', paddingTop: 10}}>
								<View style={{width: 150, paddingLeft: 20}}>
									<Text style={styles.detail_row}>Item No.:</Text>
									<Text style={styles.detail_row}>Packing:</Text>
									<Text style={styles.detail_row}>Pallet Size:</Text>
									<Text style={styles.detail_row}>Q'ty cont:</Text>
									<Text style={styles.detail_row}>Price:</Text>
								</View>
								<View style={{ }}>
									<TouchableOpacity onPress={() => Clipboard.setString(res.itemNo)}>
										<Text style={styles.detail_row}>{res.itemNo}</Text>
									</TouchableOpacity>
									<Text style={styles.detail_row}>{res.packing}</Text>
									<Text style={styles.detail_row}>{res.palletSize}</Text>
									<Text style={styles.detail_row}>{res.qtyCont}</Text>
									<Text style={styles.detail_row}>${res.price}</Text>

								</View>
							</View>
						<View style={[styles.quantityPanel, {width: isTabletLayout ? quantityWidth * 2 + 44 : quantityWidth + 28}]}>
							<View style={{flexDirection: isTabletLayout ? 'row' : 'column'}}>
								<View style={{width: quantityWidth, marginRight: isTabletLayout ? 16 : 0, marginBottom: isTabletLayout ? 0 : 16}}>
									<Text style={styles.quantityLabel}>Quantity Items</Text>
									<NumericInput
										onChange={value => this_sav.setState({qty: value})}
										onLimitReached={(isMax,msg) => alert(msg)}
										value={this_sav.state.qty}
										minValue={0}
										maxValue={Model.maxVal}
										totalHeight={Model.NumericInputH}
										totalWidth={quantityWidth}
										iconStyle={{ color: 'white' }}
										rightButtonBackgroundColor='#000'
										leftButtonBackgroundColor='#000'
									/>
								</View>
								<View style={{width: quantityWidth}}>
									<Text style={styles.quantityLabel}>Quantity Pallet/thùng/kiện</Text>
									<NumericInput
										onChange={value => this_sav.setState({qtyPallet: value})}
										onLimitReached={(isMax,msg) => alert(msg)}
										value={this_sav.state.qtyPallet}
										minValue={0}
										maxValue={Model.maxVal}
										totalHeight={Model.NumericInputH}
										totalWidth={quantityWidth}
										iconStyle={{ color: 'white' }}
										rightButtonBackgroundColor='#000'
										leftButtonBackgroundColor='#000'
									/>
								</View>
							</View>
							<View style={{marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#dce4dc'}}>
								<Text style={[styles.quantityLabel, {marginBottom: 4}]}>SL Outer: {Number(res.slOuter) > 0 ? Model.toNumberStr(Number(res.slOuter)) : 'Not available'}</Text>
								<Text style={[styles.quantityLabel, {marginBottom: 4}]}>Total Qty: {totalQty == null ? 'SL Outer required' : Model.toNumberStr(totalQty)}</Text>
								<Text style={[styles.quantityLabel, {marginBottom: 0}]}>Total Amount: {lineAmount == null ? '—' : '$' + Model.toNumberStr(lineAmount)}</Text>
							</View>
						</View>
						<View style={{marginTop: 10, paddingLeft: 20, maxHeight: 'auto'}}>
								<Text style={[styles.detail_row, {color: 'blue'}]}>Available sizes</Text>
								<Sizes
									ref={ref => Model.scanSize = ref}
									sizes={sizes}
									itemNo={res.itemNo}
								/>
							</View>
							<View style={{marginTop: 10, paddingLeft: 20, maxHeight: 'auto'}}>
								<Text style={[styles.detail_row, {color: 'blue', paddingBottom: 10}]}>Available sets</Text>
								<Sets
									ref={ref => Model.scanSet = ref}
									sets={sets}
									itemNo={res.itemNo}
								/>
							</View>
							<View style={{marginTop: 10, paddingLeft: 20, maxHeight: 'auto'}}>
								<Text style={[styles.detail_row, {color: 'blue'}]}>Available colors</Text>
								<Colors
									ref={ref => Model.scanColor = ref}
									colorData={colors}
									itemNo={res.itemNo}
								/>
							</View>
							<View style={{flexDirection: 'row', marginTop: 10}}>
								<Item stackedLabel last style={{marginLeft: 20, width: '90%'}}>
									<Label style={{color:'blue'}}>Note</Label>
									<Input 
										multiline={true} 
										onChangeText={(text) => this_sav.setState({ note: text })} 
										value={this_sav.state.note}
									/>
								</Item>
							</View>
						</Model.ScrollView>
					</View>
					</KeyboardAvoidingView>
		)
	}
}

export default Detail