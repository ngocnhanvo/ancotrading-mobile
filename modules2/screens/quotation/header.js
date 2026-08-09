import React, { Component } from 'react';
import {
	TouchableOpacity,
	Dimensions
} from 'react-native';
import stylevnn from '../../styles/public.js';
import {
	Icon
} from "../../tools/native-base";
import { HeaderNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';

let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
			dtsl: props.dtsl,
			dts: props.dts,
			props: {...props.props}
        }
        this.ref = null
    }
	onBack = (display0, this_sav) => {
		if(!Model.checkLockScreen()) {
			if(display0 == null)
				display0 = Model.formQuo ? Model.formQuo.state.display0 : true;

			if(display0)
				this_sav.state.props.navigation.goBack(null);
			else {
				Model.formQuo.setState({display0: true}, ()=>{
					this_sav.forceUpdate();
					Model.footerQuo.forceUpdate();
				});
			}
		}
    }
	render() {
		let this_sav = this;
		let display0 = Model.formQuo ? Model.formQuo.state.display0 : true;
		return(
			<HeaderNTBVNN 
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				btnLeft={
					<TouchableOpacity
						onPress={() => {
							this_sav.onBack(display0, this_sav);
						}}
					>
						<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
					</TouchableOpacity>
				}
				txtMiddle={display0 ? `Pending Quotations (${this_sav.state.dtsl})` : `Edit Infomation`}
				btnRight={
					<TouchableOpacity
						onPress={() => {
							if(display0)
								this_sav.state.props.navigation.navigate("Home", { data: ''});
							else {
								let rowData = Model.formQuo ? Model.formQuo.state.rowData : {};
								Model.this_sav.showCartInQuotation(rowData);
							}
						}}
					>
						<Icon style={[stylevnn.iconHeader, {display: display0 ? '' : 'none'}]} name="home" />
						<Icon style={[stylevnn.iconHeader, {display: display0 ? 'none' : ''}]} name="information-circle" />
					</TouchableOpacity>
				}
			/>
		)
    }
}