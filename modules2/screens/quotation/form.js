import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Platform,
	KeyboardAvoidingView,
	Dimensions,
	ScrollView,
	Keyboard
} from 'react-native';
import {
	Icon,
	Form,
	Item,
	Input,
	Label
} from "../../tools/native-base";
import Autocomplete from '../../tools/react-native-autocomplete-input';
import { ThongTinKhachHang } from "../../Model/tableSQL";
import { Model } from '../../Model/index.js';
import styles from './styles.js';
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
			note2: "",
			email: "",
			address: "",
			phone: "",
			data: "",
			customers: [],
			query: "",
			display0: props.display0 ? props.display0 : true,
			props: {...props.props}
        }
		Model.objectM.sidebar.getDateCollectData((dateStr) => {
			let where = `dateStr='${dateStr}'`;
			ThongTinKhachHang.getThongTinKhachHangs({where}, (datas) => {
				this.state.customers = datas;
			});
		});
        this.ref = null
    }
	findCustomer(query) {
		if (!query) {
			return [];
		}
		else {
			let customers = this.state.customers;
			query = query.toLowerCase();
			customers = customers.filter(function (item) {
				return item.companyName.toLowerCase().includes(query)
			});

			if (this.state.searchDTKD) 
				return customers.slice(0, 25);
			else
				return [];
		}
	}
	onFocus=() => { 
		// if(Model.footerMainQuo)
		// 	Model.footerMainQuo.setState({display: 'none'});
	}
	onBlur=() => { 
		// if(Model.footerMainQuo)
		// 	Model.footerMainQuo.setState({display: 'block'});
	}
	componentDidMount() {
		this.keyboardDidShow = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				if(Model.footerMainQuo)
					Model.footerMainQuo.setState({display: 'none'});
			}
		);

		this.keyboardDidHide = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				if(Model.footerMainQuo)
					Model.footerMainQuo.setState({display: 'block'});
			}
		);
	}
	componentWillUnmount() {
		this.keyboardDidShow.remove();
		this.keyboardDidHide.remove();
	}
	render() {
		let this_sav = this;
		const { query } = this_sav.state;
		let customers = this_sav.findCustomer(query);
		let maxHeight = deviceHeight - Model.headerH - Model.footerH;
		let heightBS = maxHeight - 600;
		heightBS = heightBS > 0 ? heightBS : 0;
		
		return (
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} style={{display: this_sav.state.display0 ? 'none' : ''}}>
			<View style={{ width: '100%', maxHeight}}>
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
								<Label>Company Name (*)</Label>
								<Autocomplete
									style={{ fontSize: 18, marginTop: Platform.OS == 'ios' ? 10 : 0, color: '#000' }}
									autoCapitalize="none"
									autoCorrect={false}
									underlineColorAndroid="transparent"
									containerStyle={styles.autocompleteContainer}
									data={customers}
									value={this_sav.state.ten_dtkd}
									defaultValue={query}
									onChangeText={text => {
										this_sav.state.ten_dtkd = text;
										this_sav.state.searchDTKD = true;
										this_sav.setState({ query: text });
									}}
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
									placeholder="Enter Name for searching"
									renderItem={({ item }) => {
										if(!Model.navigatePublic)
											Model.navigatePublic = Model.this_sav.props;

										return (
											<TouchableOpacity
												style={{ padding: 5 }}
												onPress={() => {
													this_sav.state.query = item.companyName;
													this_sav.state.ma_dtkd = item.customerCode;
													this_sav.state.ten_dtkd = item.companyName;
													this_sav.state.phone = item.Phone;
													this_sav.state.email = item.eMail;
													this_sav.state.address = item.address;
													this_sav.state.nguoilienhe = item.contactPerson;
													this_sav.state.searchDTKD = false;
													this_sav.forceUpdate();
												}}
											>
												<Text style={styles.itemText}>
													{item.companyName}
												</Text>
											</TouchableOpacity>
										)
									}}
								/>
							</Item>
							<Item stackedLabel last>
								<Label>Customer Code (*)</Label>
								<Input
									onChangeText={(text) => this_sav.setState({ ma_dtkd: text })}
									value={this_sav.state.ma_dtkd} 
									onFocus={this_sav.onFocus}
									onBlur={this_sav.onBlur}
								/>
							</Item>
						</View>

						<Item stackedLabel last>
							<Label>Person Contact (*)</Label>
							<Input 
								onChangeText={(text) => this_sav.setState({ nguoilienhe: text })} 
								value={this_sav.state.nguoilienhe} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>

						<Item stackedLabel last>
							<Label>Phone (*)</Label>
							<Input 
								onChangeText={(text) => this_sav.setState({ phone: text })} 
								value={this_sav.state.phone} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>
						<Item stackedLabel last>
							<Label>Email (*)</Label>
							<Input 
								onChangeText={(text) => this_sav.setState({ email: text })} 
								value={this_sav.state.email} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>
						<Item stackedLabel last>
							<Label>Address (*)</Label>
							<Input 
								multiline={true} 
								onChangeText={(text) => this_sav.setState({ address: text })} 
								value={this_sav.state.address} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>
						<Item stackedLabel last>
							<Label>Customer 's Brief Introduction</Label>
							<Input 
								multiline={true} 
								onChangeText={(text) => this_sav.setState({ note: text })} 
								value={this_sav.state.note} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>
						<Item stackedLabel last>
							<Label>Note</Label>
							<Input 
								multiline={true} 
								onChangeText={(text) => this_sav.setState({ note2: text })} 
								value={this_sav.state.note2} 
								onFocus={this_sav.onFocus}
								onBlur={this_sav.onBlur}
							/>
						</Item>
					</Form>
				</Model.ScrollView>
			</View>
			<View style={{height:heightBS}}></View>
			</KeyboardAvoidingView>
		)
    }
}