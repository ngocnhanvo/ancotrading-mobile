import { SQL } from "../sql";
class ThongTinKhachHang {
	static getThongTinKhachHangs = (data, callback) => {
		let st = SQL.getSkipTake(data);
		let where = SQL.getWhere(data);
		const sqlStr = `
			SELECT *
			FROM ThongTinKhachHang
			${where}
			order by companyName
			`;

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
			console.error('Error getThongTinKhachHangs:', error);
		}
	}
	static deleteThongTinKhachHangs = (data, callback) => {
		let where = SQL.getWhere(data);
		try {
			const sqlStr = `
				DELETE FROM ThongTinKhachHang ${where};
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
			console.error('Error deleteThongTinKhachHangs:', error);
		}
	};
	static insertThongTinKhachHangs = (data, callback) => {
		if(data.length <= 0) {
			callback();
			return;
		}

		try {
			const values = data.map((item) => {
				let item_customerCode = item.customerCode ? item.customerCode.replace(/'/g,"''") : '';
				let item_companyName = item.companyName ? item.companyName.replace(/'/g,"''") : '';
				let item_contactPerson = item.contactPerson ? item.contactPerson.replace(/'/g,"''") : '';
				let item_eMail = item.eMail ? item.eMail.replace(/'/g,"''") : '';
				let item_Phone = item.Phone ? item.Phone.replace(/'/g,"''") : '';
				let item_address = item.address ? item.address.replace(/'/g,"''") : '';
				return `('${item.dateStr}', '${item_customerCode}', '${item_companyName}', '${item_contactPerson}', '${item_eMail}', '${item_Phone}', '${item_address}')`;
			});	
			const sqlStr = `
				INSERT INTO ThongTinKhachHang (dateStr, customerCode, companyName, contactPerson, eMail, Phone, address) VALUES ${values.join(',')};
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
			console.error('Error ThongTinKhachHangs:', error);
		}
	};
}

export {
	ThongTinKhachHang
};