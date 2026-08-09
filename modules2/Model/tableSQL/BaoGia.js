import { SQL } from "../sql";
class BaoGia {
	static beforeInsertUpdate = (item) => {
		let BaoGiaID = item.BaoGiaID ? item.BaoGiaID : 0;
		let ma_dtkd = item.ma_dtkd ? item.ma_dtkd.replace(/'/g,"''") : '';
		let ten_dtkd = item.ten_dtkd ? item.ten_dtkd.replace(/'/g,"''") : '';
		let nguoilienhe = item.nguoilienhe ? item.nguoilienhe.replace(/'/g,"''") : '';
		let phone = item.phone ? item.phone.replace(/'/g,"''") : '';
		let email= item.email ? item.email.replace(/'/g,"''") : '';
		let address = item.address ? item.address.replace(/'/g,"''") : '';
		let note = item.note ? item.note.replace(/'/g,"''") : '';
		let note2 = item.note2 ? item.note2.replace(/'/g,"''") : '';
		let status = item.status ? item.status : 0;
		let date = item.date;
		let username = item.username;
		let qotype = item.qotype ? item.qotype : 0;
		return {
			BaoGiaID,
			ma_dtkd,
			ten_dtkd,
			nguoilienhe,
			phone,
			email,
			address,
			note,
			note2,
			status,
			date,
			username,
			qotype
		};
	}
	static countBaoGias = (data, callback) => {
		let where = SQL.getWhere(data);
		const sqlStr = `SELECT count(1) as total FROM BaoGia ${where}`;
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
			console.error('Error countBaoGias:', error);
		}
	}
	static getBaoGias = (data, callback) => {
		try {
			let st = SQL.getSkipTake(data);
			let where = SQL.getWhere(data);
			let sqlStr = `SELECT *, ROW_NUMBER() OVER (ORDER BY date) as [index] FROM BaoGia ${where} order by date desc LIMIT ${st.skip}, ${st.take}`;
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
			console.error('Error getBaoGias:', error);
		}
	}
	static insertBaoGias = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			const values = data.map((item) =>{
				let ava = BaoGia.beforeInsertUpdate(item);
				return `('${ava.date}', '${ava.ma_dtkd}', '${ava.ten_dtkd}', '${ava.nguoilienhe}', '${ava.phone}', '${ava.email}', '${ava.address}', '${ava.note}', '${ava.note2}', ${ava.status}, ${ava.qotype})`;
			});	
			const sqlStr = `
				INSERT INTO BaoGia (date, ma_dtkd, ten_dtkd, nguoilienhe, phone, email, address, note, note2, status, qotype) VALUES ${values.join(',')};
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
			console.error('Error insertBaoGias:', error);
		}
	};
	static updateBaoGias = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			SQL.open((db) => {
				db.transaction(tx => {
					let startU = 0;
					data.forEach((item) => {
						let ava = BaoGia.beforeInsertUpdate(item);
						let sqlStr = `
							UPDATE BaoGia
							SET ma_dtkd = '${ava.ma_dtkd}', 
								ten_dtkd = '${ava.ten_dtkd}',
								nguoilienhe = '${ava.nguoilienhe}',
								phone = '${ava.phone}', 
								email = '${ava.email}', 
								address = '${ava.address}',
								note = '${ava.note}', 
								note2 = '${ava.note2}', 
								status = ${ava.status},
								qotype = ${ava.qotype}
							WHERE 1 = 1
								AND BaoGiaID = ${ava.BaoGiaID}
						`;
						if(item.onlyStatus)
							sqlStr = `
								UPDATE BaoGia
								SET status = ${ava.status}, username = '${ava.username}'
								WHERE 1 = 1 AND BaoGiaID = ${ava.BaoGiaID}
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
			console.error('Error insertBaoGias:', error);
		}
	};
	static deleteBaoGias = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM BaoGia ${where};
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
			console.error('Error deleteBaoGias:', error);
		}
	};
}

export {
	BaoGia
};