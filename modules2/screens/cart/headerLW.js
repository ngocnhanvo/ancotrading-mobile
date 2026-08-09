import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import {
	Input,
	Label
} from "../../tools/native-base";
import { Model } from '../../Model';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderLW extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dtsl: 10,
			notName: Model.companyInfo.employeeVal
		};

		this.state.fullname = this.state.notName;

		if(Model.UserFullName)
			this.state.fullname = Model.UserFullName;
	}
	openBox = (this_sav) => {
		Model.objectM.dialogboxMain.pop({
			vnnType: 1,
			title: `Full Name`,
			content: (
				<View style={{height:50, width: deviceWidth/2 }}>
					<Input
						style={{backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#CCC', textAlign: 'center' }}
						onChangeText={(text) => {this_sav.state.fullname2 = text; this_sav.openBox(this_sav); }}
						value={this_sav.state.fullname2}
					/>
				</View>
			),
			btns: [
				{
					text: 'OK',
					callback: () => {
						let fullname2 = this_sav.state.fullname2;
						if(fullname2.replace(/ /g,'').length <= 0) {
							alert(`Full name is required`);
							return;
						}

						fullname2 = fullname2.trim();
						Model.UserFullName = fullname2;
						this_sav.setState({fullname: Model.UserFullName});
						Model.objectM.dialogboxMain.close();
					}
				},
				{
					text: 'Cancel',
					callback: () => {
						Model.objectM.dialogboxMain.close();
					}
				}
			]
		});
	}
	render() {
		let this_sav = this;
		let dtsl = this_sav.state.dtsl;
		return (
			dtsl <= 0 ? (
				null
			) : (
				<View style={{flex: 1, flexDirection: 'column', backgroundColor: '#efeded'}}>
					<Text style={{ flex: 1, fontSize: 18, fontWeight: 700, color: '#000', paddingTop: 10, textAlign: 'center' }}>
					{Model.companyInfo.name}
					</Text>
					<Text style={{ flex: 1, fontSize: 13, color: '#000', paddingTop: 10, textAlign: 'center' }}>
					{Model.companyInfo.address}
					</Text>
					<Text style={{ flex: 1, fontSize: 14, color: '#000', paddingTop: 10, textAlign: 'center' }}>
					{Model.companyInfo.email}
					</Text>
					<TouchableOpacity onPress={() => {
						if(this_sav.state.fullname == this_sav.state.notName)
							this_sav.state.fullname2 = '';
						else
							this_sav.state.fullname2 = this_sav.state.fullname;
						
						this_sav.openBox(this_sav);
					}}>
						<Text style={{ 
							flex: 1, 
							fontSize: 14, 
							color: '#000', 
							paddingTop: 10, 
							paddingBottom: 15, 
							textAlign: 'center',
							textDecorationLine: "underline",
							textDecorationStyle: "solid",
							textDecorationColor: "#000" 
						}}>
						{Model.companyInfo.employee} {this_sav.state.fullname}
						</Text>
					</TouchableOpacity>
				</View>
			)
		)
	}
}

