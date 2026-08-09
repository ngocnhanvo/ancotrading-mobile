import { SQL } from "../sql";
class ThongTin {
	static countThongTins = (data, callback) => {
		let where = SQL.getWhere(data);
		const sqlStr = `SELECT count(1) as total FROM ThongTin ${where}`;
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
			console.error('Error getThongTinSPs:', error);
		}
	}
	static getThongTins = (data, callback) => {
		let st = SQL.getSkipTake(data);
		let where = SQL.getWhere(data);
		let sqlStr = `SELECT * FROM ThongTin ${where} order by date desc LIMIT ${st.skip}, ${st.take}`;

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
			console.error('Error getThongTins:', error);
		}
	}
	static insertThongTins = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			const values = data.map((item) => {
				let continueV = item.continue;
				return `('${item.date}', '${item.dateStr}', ${item.slSP}, ${item.slKH}, ${item.slGet}, '', '', ${continueV}, ${item.tongSLSP}, ${item.totalSeconds})`;
			});		
			const sqlStr = `
				INSERT INTO ThongTin (date, dateStr, slSP, slKH, slGet, sps, khs, continue, tongSLSP, totalSeconds) VALUES ${values.join(',')};
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
			console.error('Error insertThongTins:', error);
		}
	};
	static deleteThongTins = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM ThongTin ${where};
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
			console.error('Error deleteThongTins:', error);
		}
	};
}

export {
	ThongTin
};