import { SQL } from "../sql";
class GioHang {
	static beforeInsertUpdate = (item) => {
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
	static sumGioHangs = (data, callback) => {
		let where = SQL.getWhere(data);
		const sqlStr = `SELECT sum(qty) as qty, round(sum(qty*cbm), 3) as cbm, round(sum(qty*price), 2) as amount FROM GioHang ${where}`;
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
	static countGioHangs = (data, callback) => {
		let where = SQL.getWhere(data);
		const sqlStr = `SELECT count(1) as total FROM GioHang ${where}`;
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
			console.error('Error countGioHangs:', error);
		}
	}
	static getGioHangs = (data, callback) => {
		try {
			let st = SQL.getSkipTake(data);
			let where = SQL.getWhere(data);
			let sqlStr = `SELECT *, ROW_NUMBER() OVER (ORDER BY itemNo) as [index] FROM GioHang ${where} order by itemNo asc LIMIT ${st.skip}, ${st.take}`;

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
			console.error('Error getGioHangs:', error);
		}
	}
	static insertGioHangs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			const values = data.map((item) => {
				let ava = GioHang.beforeInsertUpdate(item);
				return `('${ava.itemNo}', '${ava.description}', '${ava.size}', '${ava.packing}', '${ava.palletSize}', '${ava.qtyCont}', '${ava.price}', '${ava.amount}', '${ava.cbm}', '${ava.image}', '${ava.sizes}', '${ava.colors}', 1, ${ava.qty}, '${ava.note}')`;
			});	
			const sqlStr = `
				INSERT INTO GioHang (itemNo, description, size, packing, palletSize, qtyCont, price, amount, cbm, image, sizes, colors, addtocart, qty, note) VALUES ${values.join(',')};
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
			console.error('Error insertGioHangs:', error);
		}
	};
	static updateGioHangs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			SQL.open((db) => {
				db.transaction(tx => {
					let startU = 0;
					data.forEach((item) => {
						let ava = GioHang.beforeInsertUpdate(item);

						const sqlStr = `
							UPDATE GioHang
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
								addtocart = 1, 
								qty = ${ava.qty},
								note = '${ava.note}'
							WHERE 1 = 1
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
			console.error('Error insertGioHangs:', error);
		}
	};
	static deleteGioHangs = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM GioHang ${where};
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
			console.error('Error deleteGioHangs:', error);
		}
	};
}

export {
	GioHang
};