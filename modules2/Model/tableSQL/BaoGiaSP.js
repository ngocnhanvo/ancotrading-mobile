import { SQL } from "../sql";
class BaoGiaSP {
	static beforeInsertUpdate = (item) => {
		let BaoGiaID = item.BaoGiaID ? item.BaoGiaID : 0;
		let itemNo = item.itemNo ? item.itemNo.replace(/'/g,"''") : '';
		let description = item.description ? item.description.replace(/'/g,"''") : '';
		let packing = item.packing ? item.packing.replace(/'/g,"''") : '';
		let palletSize = item.palletSize ? item.palletSize.replace(/'/g,"''") : '';
		let qtyCont = item.qtyCont ? item.qtyCont.replace(/'/g,"''") : '';
		let price = item.price ? item.price.replace(/'/g,"''") : '';
		let amount = item.amount ? item.amount.replace(/'/g,"''") : '';
		let cbm = item.cbm ? item.cbm.replace(/'/g,"''") : '';
		let image = item.image ? item.image.replace(/'/g,"''") : '';
		let sizes = item.sizes ? JSON.stringify(item.sizes).replace(/'/g,"''") : '';
		let colors = item.colors ? JSON.stringify(item.colors).replace(/'/g,"''") : '';
		let qty = item.qty == null ? 1 : item.qty;
		let note = item.note ? item.note.replace(/'/g,"''") : '';
		let size = item.size ? item.size.replace(/'/g,"''") : '';
		return {
			BaoGiaID,
			itemNo,
			description,
			packing,
			palletSize,
			qtyCont,
			price,
			amount,
			cbm,
			image,
			sizes,
			colors,
			qty,
			note,
			size
		};
	}
	static sumBaoGiaSPs = (data, callback) => {
		let where = SQL.getWhere(data);
		const sqlStr = `SELECT sum(qty) as qty, round(sum(qty*cbm), 3) as cbm, round(sum(qty*price), 2) as amount FROM BaoGiaSP ${where}`;
		try {
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(
						sqlStr, 
						[], 
						(txObj, resultSet) => {
							let len = resultSet.rows.length;
							let getdatas = [];
							for (let i = 0; i < len; i++) {
								let row = resultSet.rows.item(i);
								getdatas.push(row);
							}
							callback(getdatas[0]);
						},
						(error) => {
							console.error('Error:', error);
						}
					);
				});
			});
		} 
		catch (error) {
			console.error('Error sumGioHangs:', error);
		}
	}
	static countBaoGiaSPs = (data, callback) => {
		try {
			let where = SQL.getWhere(data);
			const sqlStr = `SELECT count(1) as total FROM BaoGiaSP ${where}`;
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(
						sqlStr, 
						[], 
						(txObj, resultSet) => {
							let len = resultSet.rows.length;
							let getdatas = [];
							for (let i = 0; i < len; i++) {
								let row = resultSet.rows.item(i);
								getdatas.push(row);
							}
							callback(getdatas[0]);
						},
						(error) => {
							console.error('Error:', error);
						}
					);
				});
			});
		} 
		catch (error) {
			console.error('Error getBaoGiaSPs:', error);
		}
	}
	static getBaoGiaSPs = (data, callback) => {
		try {
			let st = SQL.getSkipTake(data);
			let where = SQL.getWhere(data);
			const sqlStr = `
				SELECT *, ROW_NUMBER() OVER (ORDER BY itemNo) as [index]
				FROM BaoGiaSP
				${where}
				order by itemNo
				LIMIT ${st.skip}, ${st.take}
			`;

			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(
						sqlStr, 
						[], 
						(txObj, resultSet) => {
							let len = resultSet.rows.length;
							let getdatas = [];
							for (let i = 0; i < len; i++) {
								let row = resultSet.rows.item(i);
								row.sizes = JSON.parse(row.sizes);
								row.colors = JSON.parse(row.colors);
								getdatas.push(row);
							}
							callback(getdatas);
						},
						(error) => {
							console.error('Error:', error);
						}
					);
				});
			});
		} 
		catch (error) {
			console.error('Error getBaoGiaSPs:', error);
		}
	}
	static deleteBaoGiaSPs = (data, callback) => {
		try {
			let where = SQL.getWhere(data);
			const sqlStr = `
				DELETE FROM BaoGiaSP ${where};
			`;
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(sqlStr, [], (tx, results) => {
						callback(results);
					},
					(error) => {
						console.error('Error:', error);
					});
				});
			});
		} catch (error) {
			console.error('Error BaoGiaSPs:', error);
		}
	};
	static insertBaoGiaSPs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			
			const values = data.map((item) => {
				let ava = BaoGiaSP.beforeInsertUpdate(item);
				return `(${ava.BaoGiaID}, '${ava.itemNo}', '${ava.description}', '${ava.size}', '${ava.packing}', '${ava.palletSize}', '${ava.qtyCont}', '${ava.price}', '${ava.amount}', '${ava.cbm}', '${ava.image}', '${ava.sizes}', '${ava.colors}', ${ava.qty}, '${ava.note}')`;
			});	
			const sqlStr = `
				INSERT INTO BaoGiaSP (BaoGiaID, itemNo, description, size, packing, palletSize, qtyCont, price, amount, cbm, image, sizes, colors, qty, note) VALUES ${values.join(',')};
			`;
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(sqlStr, [], (tx, results) => {
						callback(results);
					},
					(error) => {
						console.error('Error:', error);
					});
				});
			});
		} catch (error) {
			console.error('Error insertBaoGiaSPs:', error);
		}
	};
	static updateBaoGiaSPs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			SQL.open((db) => {
				db.transaction(tx => {
					let startU = 0;
					data.forEach((item) => {
						let ava = BaoGiaSP.beforeInsertUpdate(item);
						const sqlStr = `
							UPDATE BaoGiaSP
							SET packing = '${ava.packing}', 
								description = '${ava.description}',
								size = '${ava.size}',
								palletSize = '${ava.palletSize}',
								qtyCont = '${ava.qtyCont}',
								price = '${ava.price}', 
								amount = '${ava.amount}', 
								cbm = '${ava.cbm}',
								image = '${ava.image}', 
								sizes = '${ava.sizes}', 
								colors = '${ava.colors}',
								qty = ${ava.qty},
								note = '${ava.note}'
							WHERE 1 = 1
								AND BaoGiaID = ${ava.BaoGiaID}
								AND itemNo = '${ava.itemNo}'
						`;
						tx.executeSql(sqlStr, [], (tx, results) => {
							startU++;
							if(startU >= data.length)
								callback(results);
						},
						(error) => {
							console.error('Error:', error);
						});
					});
				});
			});
		} catch (error) {
			console.error('Error updateBaoGiaSPs:', error);
		}
	};
	static deleteBaoGiaSPs = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM BaoGiaSP ${where};
			`;
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(sqlStr, [], (tx, results) => {
						callback(results);
					},
					(error) => {
						console.error('Error:', error);
					});
				});
			});
		} catch (error) {
			console.error('Error deleteBaoGiaSPs:', error);
		}
	};
}

export {
	BaoGiaSP
};