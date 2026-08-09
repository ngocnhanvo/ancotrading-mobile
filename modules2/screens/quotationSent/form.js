import React, { Component } from 'react'
import {
	View,
	Text,
	Platform,
	KeyboardAvoidingView,
	Dimensions,
} from 'react-native';
import {
	Icon,
	Form,
	Item,
	Input,
	Label
} from "../../tools/native-base";
import { Model } from '../../Model/index.js';
import SelectDropdown from 'react-native-select-dropdown';
import stylevnn from '../../styles/public.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FormSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
			rowData: {},
			qotype: 0,
            ma_dtkd: "",
			ten_dtkd: "",
			nguoilienhe: "",
			note: "",
			email: "",
			address: "",
			phone: "",
			data: "",
			customers: [],
			query: "",
			display0: props.display0 ? props.display0 : true,
			props: {...props.props}
        }
        this.ref = null
    }
	onFocus=() => { 

	}
	onBlur=() => { 

	}
	render() {
		let this_sav = this;
		return(
			<View style={{ display: this_sav.state.display0 ? 'none' : '', height: deviceHeight - Model.headerH }}>
				<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
					<Model.ScrollView>
						<Form style={{ paddingBottom: 75, paddingTop: 10, paddingRight: 10, backgroundColor: '#FFFFFF' }}>
							<View>
								<Item style={{paddingTop: 10, paddingBottom: 10}}>
									<Label>QO Type (*)</Label>
									<SelectDropdown
									data={Model.qoTypes}
									ref={ref=>this_sav.state.selectDropDown = ref}
									onSelect={(selectedItem, index) => {
										this_sav.state.qotype = selectedItem.id;
									}}
									renderButton={(selectedItem, isOpened) => {
										let id = selectedItem ? selectedItem.id : this_sav.state.qotype;
										let item = Model.qoTypes.filter((a)=>{return a.id == id})[0];
										if(!item)
											return (<View></View>);
	
										return (
											<View style={{flex: 1}}>
												<View style={[stylevnn.dropdownButtonStyle, {width: 200}]}>
													<Text style={stylevnn.dropdownButtonTxtStyle}>{item.value}</Text>
													<Icon style={[stylevnn.iconHeader, {color: '#000'}]} name="arrow-down" />
												</View>
											</View>
										);
									}}
									renderItem={(item, index, isSelected) => {
										if(!item)
											return (<View></View>);
										
										return (
											<View>
												<View style={{...stylevnn.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
													<Text style={[stylevnn.dropdownItemTxtStyle, {textAlign: 'left'}]}>{item.value}</Text>
												</View>
											</View>
										);
									}}
									disableAutoScroll={true}
									showsVerticalScrollIndicator={true}
									dropdownStyle={[stylevnn.dropdownMenuStyle, {height: 100}]}
								/>
								</Item>
							</View>
							<View>
								<Item stackedLabel last>
									<Label>Company Name</Label>
									<Input
										//onChangeText={(text) => this.setState({ ma_dtkd: text })}
										value={this.state.ten_dtkd} 
										onFocus={this_sav.onFocus}
										onBlur={this_sav.onBlur}
										showSoftInputOnFocus={false}
									/>
								</Item>
								<Item stackedLabel last>
									<Label>Customer Code</Label>
									<Input
										//onChangeText={(text) => this.setState({ ma_dtkd: text })}
										value={this.state.ma_dtkd} 
										onFocus={this_sav.onFocus}
										onBlur={this_sav.onBlur}
										showSoftInputOnFocus={false}
									/>
								</Item>
							</View>

							<Item stackedLabel last>
								<Label>Person Contact</Label>
								<Input 
									//onChangeText={(text) => this.setState({ nguoilienhe: text })} 
									value={this.state.nguoilienhe} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>

							<Item stackedLabel last>
								<Label>Phone</Label>
								<Input 
									//onChangeText={(text) => this.setState({ phone: text })} 
									value={this.state.phone} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>
							<Item stackedLabel last>
								<Label>Email</Label>
								<Input 
									//onChangeText={(text) => this.setState({ email: text })} 
									value={this.state.email} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>
							<Item stackedLabel last>
								<Label>Address</Label>
								<Input 
									multiline={true} 
									//onChangeText={(text) => this.setState({ address: text })} 
									value={this.state.address} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>
							<Item stackedLabel last>
								<Label>Customer 's Brief Introduction</Label>
								<Input 
									multiline={true} 
									//onChangeText={(text) => this.setState({ note: text })} 
									value={this.state.note} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>
							<Item stackedLabel last>
								<Label>Note</Label>
								<Input 
									multiline={true} 
									//onChangeText={(text) => this.setState({ note2: text })} 
									value={this.state.note2} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									showSoftInputOnFocus={false}
								/>
							</Item>
							<View style={{height:30}}></View>
						</Form>
					</Model.ScrollView>
				</KeyboardAvoidingView>
			</View>
		)
    }
}