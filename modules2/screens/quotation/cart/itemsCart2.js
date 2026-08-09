import React, {
	PureComponent
} from 'react'
import {
	View,
	Dimensions,
	Image
} from 'react-native';
import {
	Button,
	Icon,
} from "../../../tools/native-base";
import styles from '../styles.js';
import { Model } from '../../../Model';
import { BaoGiaSP } from '../../../Model/tableSQL/BaoGiaSP.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class items2 extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			rowData: {...props.rowData},
			pageSep: props.pageSep,
			pageNum: props.pageNum
		};
	}
	render() {
		let this_sav = this;
		let rowData = this_sav.state.rowData;
		let index = rowData.index;
		
		return (
			<View
				key={index}
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
					onPress={() => {
						let where = `BaoGiaID = ${rowData.BaoGiaID} and itemNo='${rowData.itemNo}'`;
						BaoGiaSP.deleteBaoGiaSPs({where}, () => {
							Model.quotationCart.createPage(Model.quotationCart);
						});
					}}
					style={[styles.backRightBtn]}
				>
					<Icon active name="trash" style={{ fontSize: 30 }} />
				</Button>
			</View>
		)
	}
}

