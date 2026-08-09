import { SQL } from "../sql";
class ThongTinSP {
	static beforeInsertUpdate = (item) => {
		let itemNo = item.itemNo ? item.itemNo.replace(/'/g,"''") : '';
		let description = item.description ? item.description.replace(/'/g,"''") : '';
		let colorName = item.colorName ? item.colorName.replace(/'/g,"''") : '';
		let packing = item.packing ? item.packing.replace(/'/g,"''") : '';
		let palletSize = item.palletSize ? item.palletSize.replace(/'/g,"''") : '';
		let qtyCont = item.qtyCont ? item.qtyCont.replace(/'/g,"''") : '';
		let price = item.price ? item.price.replace(/'/g,"''") : '';
		let amount = item.amount ? item.amount.replace(/'/g,"''") : '';
		let cbm = item.cbm ? item.cbm.replace(/'/g,"''") : '';
		let image = item.image ? item.image.replace(/'/g,"''") : '';
		let sizes = item.sizes ? JSON.stringify(item.sizes).replace(/'/g,"''") : '';
		let colors = item.colors ? JSON.stringify(item.colors).replace(/'/g,"''") : '';
		let size = item.size ? item.size.replace(/'/g,"''") : '';
		return {
			itemNo,
			description,
			colorName,
			packing,
			palletSize,
			qtyCont,
			price,
			amount,
			cbm,
			image,
			size,
			sizes,
			colors
		};
	}
	static countThongTinSPs = (data, callback) => {
		try {
			let where = SQL.getWhere(data);
			const sqlStr = `SELECT count(1) as total FROM ThongTinSP ${where}`;
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
			console.error('Error getThongTinSPs:', error);
		}
	}
	static getThongTinSPs = (data, callback) => {
		let st = SQL.getSkipTake(data);
		let where = SQL.getWhere(data);
		let sqlStr = ``;
		if(data.BaoGiaID) {
			if(data.searchStr)
				where = `${where} and t1.itemNo like '%${data.searchStr}%'`;

			sqlStr = `
			SELECT t1.*, 
			CASE 
				WHEN t2.itemNo IS NULL THEN 0
				ELSE 1
			END AS addtoquotation,
			ROW_NUMBER() OVER (ORDER BY t1.itemNo) as [index]
			FROM ThongTinSP t1
			LEFT JOIN BaoGiaSP t2 on t1.itemNo = t2.itemNo and t2.BaoGiaID = ${data.BaoGiaID}
			${where} and t1.dateStr = '${data.dateStr}' and addtoquotation = 0
			LIMIT ${st.skip}, ${st.take}
			`;
		}
		else {
			if(data.searchStr)
				where = data.scan ? `${where} and t1.itemNo = '${data.searchStr}'` : `${where} and t1.itemNo like '%${data.searchStr}%'`;

			sqlStr = `SELECT 
				t1.*, 
				CASE 
					WHEN t2.itemNo IS NULL THEN 0
					ELSE 1
				END AS addtocart,
				ROW_NUMBER() OVER (ORDER BY t1.itemNo) as [index]
			FROM ThongTinSP t1
			LEFT JOIN GioHang t2 on t1.itemNo = t2.itemNo
			${where} and t1.dateStr = '${data.dateStr}'
			ORDER BY t1.itemNo
			LIMIT ${st.skip}, ${st.take}`;
		}

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
			console.error('Error getThongTinSPs:', error);
		}
	}
	static deleteThongTinSPs = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM ThongTinSP ${where};
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
			console.error('Error ThongTinSPs:', error);
		}
	};
	static insertThongTinSPs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			let keys = [], sqls = [];
			data.map((item) => {
				let ava = ThongTinSP.beforeInsertUpdate(item);
				keys.push(item.dateStr + ava.itemNo);
				sqls.push(`('${item.dateStr}', '${ava.itemNo}', '${ava.description}', '${ava.size}', '${ava.colorName}', '${ava.packing}', '${ava.palletSize}', '${ava.qtyCont}', '${ava.price}', '${ava.amount}', '${ava.cbm}', '${ava.image}', '${ava.sizes}', '${ava.colors}')`);
			});
			SQL.open((db) => {
				db.transaction(tx => {
					tx.executeSql(`select dateStr, itemNo from ThongTinSP where (dateStr + itemNo) in ('${keys.join(',')}')`, [], (tx1, results) => {
						let len = results.rows.length;
						if(len > 0) {
							for(let j = sqls.length - 1; j >= 0; j--) {
								for (let i = 0; i < len; i++) {
									let row = results.rows.item(i);
									if(sqls[j].startsWith(`('${row.dateStr}', '${row.itemNo}'`))
										sqls.splice(j, 1);
								}
							}
						}

						const sqlStr = `INSERT INTO ThongTinSP (dateStr, itemNo, description, size, colorName, packing, palletSize, qtyCont, price, amount, cbm, image, sizes, colors) VALUES ${sqls.join(',')};`;
						tx.executeSql(sqlStr, [], (tx2, results2) => {
							callback(results2);
						},
						(error) => {
							console.error('Error:', error);
						});
					});
				});
			});
		} catch (error) {
			console.error('Error insertThongTins:', error);
		}
	};
}

export {
	ThongTinSP
};