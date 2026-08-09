import React, { PureComponent } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import {
	Icon
} from "../../tools/native-base";
import { HeaderNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';
import PrintMain from './print.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderSPD extends PureComponent {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: props.count_cart,
			count_quotation: 0,
			dtsl: props.dtsl,
			display0: props.display0,
			props: {...props.props}
        }
        this.ref = null
    }
	onBack = (this_sav) => {
		if(!Model.checkLockScreen()) {
			if(this_sav.state.display0) {
				this_sav.state.props.navigation.goBack(null);
			}
			else {
				Model.objectM.spinnerMain.show();
				this_sav.setState({display0: true});
				Model.footerCrt.setState({display0: true});
				Model.formCrt.setState({display0: true}, ()=> {
					Model.objectM.spinnerMain.close();
				});
			}
		}
	}
	render() {
		let this_sav = this;
		return(
			<HeaderNTBVNN
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				btnLeft={
					<TouchableOpacity
						onPress={() => {
							this_sav.onBack(this_sav)
						}}
					>
						<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
					</TouchableOpacity>
				}
				txtMiddle={this_sav.state.display0 ? `Cart (${this_sav.state.count_cart})`: `PLEASE FILL YOUR INFORMATION`}
				btnRight={
					<TouchableOpacity
						onPress={() => {
							if(this_sav.state.display0)
							{
								this_sav.state.props.navigation.navigate("Scan", { data: '' });
								return;
							}

							const footerCrt = Model.footerCrt;
							let partner = {};
							if(footerCrt) {
								footerCrt.onChange(footerCrt);
								partner = footerCrt.checkData(footerCrt);
								if(partner == false)
									return;
							}

							Model.objectM.dialogboxMain2.pop({
								vnnType: 1,
								title: ``,
								content: (
									<View style={{width:deviceWidth, height: deviceHeight - deviceHeight/4}}>
										<PrintMain partner={partner} />
									</View>
								),
								btns: [
									{
										text: 'Cancel',
										callback: () => {
											Model.objectM.dialogboxMain2.close();
										}
									}
								]
							});
						}}
					>
						<Icon style={[stylevnn.iconHeader]} name={this_sav.state.display0 ? "qr-scanner" : "print"} />
					</TouchableOpacity>
				}
			/>
		)
    }
}