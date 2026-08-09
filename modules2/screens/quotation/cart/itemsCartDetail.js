import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	Dimensions,
	KeyboardAvoidingView
} from 'react-native'
import {
	Input,
	Icon,
} from "../../../tools/native-base";
import stylevnn from '../../../styles/public.js';
import SelectDropdown from 'react-native-select-dropdown'
import { Model } from '../../../Model';
import NumericInput from '../../../react-native-numeric-input';
import { ScrollView } from 'react-native';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class ItemsDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rowData: {...props.rowData}
		};
		this.state.itemSel = this.state.rowData.itemNo;
		this.state.qty = this.state.rowData.qty;
		this.state.note = this.state.rowData.note;
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		
		return (
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
			<View style={{maxHeight: deviceHeight/2, width: deviceWidth - deviceWidth/4}}>
				<ScrollView>
					<View>
						<Text style={{color: 'blue', paddingBottom: 5}}>Quantity</Text>
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
					<View style={{paddingTop: 20}}>
						<Text style={{color: 'blue', paddingBottom: 5}}>Color</Text>
						<SelectDropdown
							style={{flex: 1}}
							data={rowData.colors}
							onSelect={(selectedItem, index) => {
								this_sav.state.itemSel = selectedItem.itemNo;
							}}
							renderButton={(selectedItem, isOpened) => {
								return (
								<View style={[stylevnn.dropdownButtonStyle, {alignItems:'center', width: deviceWidth/2}]}>
									<Text style={stylevnn.dropdownButtonTxtStyle}>
									{(selectedItem && selectedItem.itemNo) || rowData.itemNo}
									</Text>
									<Icon style={stylevnn.iconHeader} name="arrow-down" />
								</View>
								);
							}}
							renderItem={(item, index, isSelected) => {
								return (
									<View style={{...stylevnn.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
										<Text style={stylevnn.dropdownItemTxtStyle}>{item.itemNo}</Text>
									</View>
								);
							}}
							disableAutoScroll={true}
							showsVerticalScrollIndicator={true}
							dropdownStyle={stylevnn.dropdownMenuStyle}
						/>
					</View>
					<View style={{paddingTop: 20, textAlignVertical: 'top'}}>
						<Text style={{color: 'blue' }}>Note</Text>
						<Input 
							multiline={true} 
							onChangeText={(note) => this_sav.setState({note}) }
							value={this_sav.state.note}
							style={{borderBottomWidth: 1, borderBottomColor: '#CCC'}}
						/>
					</View>
				</ScrollView>
			</View>
			</KeyboardAvoidingView>
		)
	}
}

