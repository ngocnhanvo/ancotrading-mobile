import React, {
	PureComponent
} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Model } from '../../Model';
import { ThongTinSP } from '../../Model/tableSQL';
export default class SizesDetail extends PureComponent {
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
		let size = item.itemNo.substr(9,2);
		let cssMore = {};
		if(item.itemNo == itemNo) {
			cssMore.backgroundColor = '#def0b9';
			cssMore.fontWeight = '700';
		}
	
		if(item.colorName)
			cssMore.borderWidth = 1;
		else
			cssMore.borderWidth = 0;

		let isSizeS = size.startsWith('S'), isSize0 = size.startsWith('0'), isSize1 = size.startsWith('S1');
		let isNexx = /[a-zA-Z][a-zA-Z]/.test(size);
		let content = null;
		
		if(isSize0 | isSize1 | isNexx)
			content = (<Text style={[styles.sizeName, cssMore]}>Size {size}: {item.size}</Text>);
		else if(isSizeS)
			content = (<Text style={[styles.sizeName, cssMore]}>Size {size}: Full set (all size)</Text>);

		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity onPress={() => {
					let res = Model.detailScan.state.res;
					if(res.itemNo == item.itemNo)
						return;
					
					let items = Model.scanSizeDetail;
					for(let i in items) {
						if(items[i])
							items[i].setState({itemNo:item.itemNo});
					}
					
					//Lấy màu sắc của kích thước tương ứng
					let arr = [];
					item.colors.map(function(obj) {
						arr.push(obj.itemNo);
					});
					let where = `and t1.itemNo in ('${arr.join("','")}')`;
					//Model.objectM.spinnerMain.show();
					ThongTinSP.getThongTinSPs({dateStr: res.dateStr, where}, (colorData) => {
						Model.scanColorDetail = [];
						Model.scanColor.state.itemNo = item.itemNo;
						Model.scanColor.setState({colorData},() => {
							//Model.objectM.spinnerMain.close();
						});
					});

					//Làm mới biến tấu
					where = `and t1.itemNo like '%${item.itemNo.substr(0, 9)}__${item.itemNo.substr(11, 3)}%'`;
					//Model.objectM.spinnerMain.show();
					ThongTinSP.getThongTinSPs({dateStr: res.dateStr, where}, (sizeData) => {
						for (const key in item) {
							if (res.hasOwnProperty(key))
								res[key] = item[key];
						}
						res.sizes = sizeData;
						for(let i in res.sizes) {
							let res_size = res.sizes[i];
							if(res_size.itemNo == item.itemNo) {
								res_size.sizes = item.sizes;
							}
						}
						Model.detailScan.forceUpdate();
						const sizeSets = Model.getSizeSets(sizeData);
						let sets = sizeSets.sets;
						let sizes = sizeSets.sizes;
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
						MscanSet.setState({itemNo: item.itemNo, contentSet: null, sets}, ()=>{
							MscanSet.state.selectDropDown.selectIndex(0);
							MscanSet.forceUpdate();
						});
					});
				}}>
					{content}
				</TouchableOpacity>
			</View>
		);
	}
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 10,
    alignItems: 'left',
  },
  sizeName: {
    fontSize: 13,
	color: '#000',
    textAlign: 'left',
	padding: 5,
	marginTop: 5,
	borderColor: '#ccc',
	flexShrink: 0,
	width: 250
  },
});