import React, {
	PureComponent
} from 'react'
import {
	View,
	Image,
	Dimensions,
} from 'react-native'
import {
	Button,
	Icon,
} from "../../tools/native-base";
import styles from './styles.js';
import { Model } from '../../Model';
import { GioHang } from "../../Model/tableSQL";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class Items2 extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rowData: {...props.rowData}
		};
	}
	removeProduct(ma_sanpham) {
		GioHang.deleteGioHangs({where: `itemNo='${ma_sanpham}'`}, () => {
			Model.this_sav.createPage(Model.this_sav);
		});
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		return (
			<View
				key={rowData.index}
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
					danger
					onPress={() => { this_sav.removeProduct(rowData.itemNo); }}
					style={[styles.backRightBtn]}
				>
					<Icon active name="trash" style={{ fontSize: 30 }} />
				</Button>
			</View>
		)
	}
}

