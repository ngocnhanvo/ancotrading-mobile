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

		this.state.qty = this.state.res.qty ? this.state.res.qty : 1;
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
								<View style={{width: 120, paddingLeft: 20}}>
									<Text style={styles.detail_row}>Item No.:</Text>
									<Text style={styles.detail_row}>Packing:</Text>
									<Text style={styles.detail_row}>Pallet Size:</Text>
									<Text style={styles.detail_row}>Q'ty cont:</Text>
									<Text style={styles.detail_row}>Price:</Text>
									<Text style={[styles.detail_row,{paddingTop: 5}]}>Quantity:</Text>
								</View>
								<View style={{ }}>
									<TouchableOpacity onPress={() => Clipboard.setString(res.itemNo)}>
										<Text style={styles.detail_row}>{res.itemNo}</Text>
									</TouchableOpacity>
									<Text style={styles.detail_row}>{res.packing}</Text>
									<Text style={styles.detail_row}>{res.palletSize}</Text>
									<Text style={styles.detail_row}>{res.qtyCont}</Text>
									<Text style={styles.detail_row}>${res.price}</Text>
									<NumericInput
										onChange={value => this_sav.state.qty = value} 
										onLimitReached={(isMax,msg) => alert(msg)}
										value={this_sav.state.qty}
										minValue={Model.minVal}
										maxValue={Model.maxVal}
										totalHeight={Model.NumericInputH}
										totalWidth={Model.NumericInputW}
										iconStyle={{ color: 'white' }}
										rightButtonBackgroundColor='#000' 
										leftButtonBackgroundColor='#000'
									/>
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