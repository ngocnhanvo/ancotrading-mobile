import React, {
	PureComponent
} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Model } from '../../Model';
import { ThongTinSP } from '../../Model/tableSQL';
export default class ColorsDetail extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			item: props.item,
			itemNo: props.itemNo,
		};
	}
	render() {
		let this_sav = this;
		let item = this_sav.state.item;
		let itemNo = this_sav.state.itemNo;
		let cssMore = {};

		if(item.itemNo == itemNo) {
			cssMore.backgroundColor = '#def0b9';
			cssMore.fontWeight = '700';
		}
	
		if(item.colorName)
			cssMore.borderWidth = 1;
		else
			cssMore.borderWidth = 0;

		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity onPress={() => {
					if(!item.itemNo)
						return;

					let res = Model.detailScan.state.res;
					if(item.itemNo == res.itemNo)
						return;

					let items = Model.scanColorDetail;
					for(let i in items) {
						if(items[i])
							items[i].setState({itemNo:item.itemNo});
					}

					let sizeMain = `${item.itemNo.substr(0, 9)}__${item.itemNo.substr(11, 3)}`;
					let where = `and t1.itemNo like '%${sizeMain}%'`;
					//Model.objectM.spinnerMain.show();
					ThongTinSP.getThongTinSPs({dateStr: res.dateStr, where}, (datas) => {
						for (const key in item) {
							if (res.key != "sizes")
								res[key] = item[key];
						}
						res = Model.getColorsAndSizes(datas, res);
						//res.sizes = sizeData;
						// for(let i in res.sizes) {
						// 	let res_size = res.sizes[i];
						// 	if(res_size.itemNo == item.itemNo) {
						// 		console.log()
						// 		res_size.sizes = item.sizes.filter((s)=> {return s.itemNo == item.itemNo})[0].sizes;
						// 	}
						// }
						Model.detailScan.forceUpdate();

						Model.scanSizeDetail = [];
						Model.scanSize.state.itemNo = item.itemNo;
						Model.scanSet.state.itemNo = item.itemNo;
						const sizeSets = Model.getSizeSets(res.sizes);
						const sizes = sizeSets.sizes;
						Model.scanSize.setState({sizes},() => {
							items = Model.scanSizeDetail;
							for(let i in items) {
								if(items[i])
									items[i].setState({itemNo:item.itemNo});
							}
						});

						let sets = sizeSets.sets;
						for(let i in sets) {
							let set = sets[i];
							let setSizes = set.sizes.filter((a)=>{ return a.itemNo == set.itemNo })[0];
							if(setSizes)
							{
								set.sizes = [...setSizes.sizes];
								for(let j in set.sizes) {
									let size = set.sizes[j];
									let sizeSizes = sizes.filter((a) => { return a.itemNo == size.itemNo })[0];
									if(sizeSizes) {
										for (const key in sizeSizes) {
											if (size.hasOwnProperty(key)) {
												size[key] = sizeSizes[key];
											}
										}
									}
								}
							}
						}
						let MscanSet = Model.scanSet;
						MscanSet.state.itemNo = item.itemNo;
						MscanSet.setState({sets}, ()=> {
							let indexSet = sets.findIndex(a => a.itemNo === item.itemNo);
							let itemSet = null;
							if(indexSet != -1)
								itemSet = sets[indexSet];

							if(itemSet) {
								MscanSet.state.selectDropDown.selectIndex(indexSet);
								MscanSet.select(itemSet, MscanSet, false);
								MscanSet.forceUpdate();
							}
						});
					});
				}}>
					<Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={{ width: 100, height: 100 }} />
					<Text style={[styles.colorName, cssMore]}>{item.colorName}</Text>
				</TouchableOpacity>
			</View>
		);
	}
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1, // Chia đều không gian trong hàng
    margin: 10,
    alignItems: 'center', // Căn giữa theo chiều ngang
    // Các style khác cho item container nếu cần
  },
  colorName: {
    fontSize: 12,
	color: '#000',
    textAlign: 'center',
	padding: 5,
	marginTop: 5,
	borderWidth: 1,
	borderColor: '#ccc'
  },
});