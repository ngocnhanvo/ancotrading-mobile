import SQLite from 'react-native-sqlite-storage';

class SQL {
	static dbMain;
	static addColumns(db, callback) {
		let max = 0, count = 0;
		let afterExec = () => {
			count++;
			if(count >= max) {
				callback();
			}
		}
		let checkAndAddColumn = (table, column, type) => {
			max++;
			db.transaction(tx => {
				tx.executeSql(
					`SELECT COUNT(1) as total FROM pragma_table_info('${table}') WHERE name = '${column}'`,
					[], 
					(_, results) => {
						const columnExists = results.rows.item(0)['total'] > 0;
							if (!columnExists)
							{
								tx.executeSql(
									`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, 
									[], 
									() => {
										afterExec(count);
									}, (error) => {
										alert(error.message);
										afterExec(count);
									}
								)
							}
							else {
								afterExec(count);
							}
					},
					(error) => {
						alert(error.message);
						afterExec(count);
					}
				);
			});
		}

		//Thêm column vào table đã tồn tại
		checkAndAddColumn('ThongTinSP', 'colorName', 'TEXT');
		checkAndAddColumn('ThongTinSP', 'description', 'TEXT');
		checkAndAddColumn('ThongTinSP', 'size', 'TEXT');
		checkAndAddColumn('GioHang', 'note', 'TEXT');
		checkAndAddColumn('GioHang', 'description', 'TEXT');
		checkAndAddColumn('GioHang', 'colorName', 'TEXT');
		checkAndAddColumn('GioHang', 'size', 'TEXT');
		checkAndAddColumn('BaoGiaSP', 'note', 'TEXT');
		checkAndAddColumn('BaoGiaSP', 'description', 'TEXT');
		checkAndAddColumn('BaoGiaSP', 'colorName', 'TEXT');
		checkAndAddColumn('BaoGiaSP', 'size', 'TEXT');
		checkAndAddColumn('BaoGia', 'username', 'TEXT');
		checkAndAddColumn('BaoGia', 'qotype', 'INTEGER');
	}
	static open(callback) {
		//SQLite.enablePromise(true);
		let sqlarr = [], sql = '';
		sql = `CREATE TABLE IF NOT EXISTS ThongTin (
					ThongTinID INTEGER PRIMARY KEY AUTOINCREMENT, 
					date DATE,
					dateStr TEXT,
					slSP INTEGER,
					slKH INTEGER,
					slGet INTEGER,
					sps TEXT,
					khs TEXT,
					continue INTEGER,
					tongSLSP INTEGER,
					tongSLKH INTEGER,
					totalSeconds INTEGER
				);`;
		sqlarr.push(sql);
		
		sql = `CREATE TABLE IF NOT EXISTS ThongTinSP (
					ThongTinSPID INTEGER PRIMARY KEY AUTOINCREMENT,
					dateStr TEXT,
					itemNo TEXT,
					description TEXT,
					packing TEXT,
					palletSize TEXT,
					qtyCont TEXT,
					price TEXT,
					amount TEXT,
					cbm TEXT,
					image TEXT,
					size TEXT,
					sizes TEXT,
					colors TEXT
				);`;
		sqlarr.push(sql);

		sql = `CREATE TABLE IF NOT EXISTS ThongTinKhachHang (
					ThongTinKhachHangID INTEGER PRIMARY KEY AUTOINCREMENT,
					dateStr TEXT,
					customerCode TEXT,
					companyName TEXT,
					contactPerson TEXT,
					eMail TEXT,
					Phone TEXT,
					address TEXT
				);`;
		sqlarr.push(sql);

		sql = `CREATE TABLE IF NOT EXISTS GioHang (
					GioHangID INTEGER PRIMARY KEY AUTOINCREMENT,
					itemNo TEXT,
					description TEXT,
					packing TEXT,
					palletSize TEXT,
					qtyCont TEXT,
					price TEXT,
					amount TEXT,
					cbm TEXT,
					image TEXT,
					size TEXT,
					sizes TEXT,
					colors TEXT,
					addtocart INTEGER,
					qty INTEGER,
					note TEXT
				);`;
		sqlarr.push(sql);

		sql = `CREATE TABLE IF NOT EXISTS BaoGia (
					BaoGiaID INTEGER PRIMARY KEY AUTOINCREMENT,
					date DATE,
					ma_dtkd TEXT,
					ten_dtkd TEXT,
					nguoilienhe TEXT,
					phone TEXT,
					email TEXT,
					address TEXT,
					note TEXT,
					note2 TEXT,
					status INTEGER,
					username TEXT,
					qotype INTEGER
				);`;
		sqlarr.push(sql);

		sql = `CREATE TABLE IF NOT EXISTS BaoGiaSP (
					BaoGiaSPID INTEGER PRIMARY KEY AUTOINCREMENT,
					BaoGiaID INTEGER,
					itemNo TEXT,
					description TEXT,
					packing TEXT,
					palletSize TEXT,
					qtyCont TEXT,
					price TEXT,
					amount TEXT,
					cbm TEXT,
					image TEXT,
					size TEXT,
					sizes TEXT,
					colors TEXT,
					qty INTEGER,
					note TEXT
				);`;
		sqlarr.push(sql);

		sql = `CREATE INDEX IF NOT EXISTS idx_thongtinsp_datestr ON ThongTinSP (dateStr);`
		sqlarr.push(sql);
		
		sql = `CREATE INDEX IF NOT EXISTS idx_thongtinsp_itemno ON ThongTinSP (itemNo);`;
		sqlarr.push(sql);

		const lenArr = sqlarr.length;
		let execNum = 0;
		const db = SQLite.openDatabase(
			{
				name: 'anco2019.db', 
				createFromLocation: 1
			}, 
			() => {
				if(SQL.dbMain) {
					SQL.dbMain = db;
					callback(db);
					return;
				}

				const afterExec = ()=> {
					execNum++;
					if(execNum >= lenArr) {
						SQL.addColumns(db, () => {
							SQL.dbMain = db;
							callback(db);
						});
					}
				}
				db.transaction(tx => {
					for(let i = 0; i < lenArr; i++) {
						sql = sqlarr[i];
						tx.executeSql(
							sql, 
							[], 
							() => {
								afterExec();
							},
							(error) => {
								afterExec();
								alert(error.message);
							}
						);
					}
				});
			}, 
			(error) => {
				alert(error.message);
			}
		);
	}
	static getWhere(data) {
		let where = 'WHERE 1=1';
		if(data) {
			if(data.where) {
				if(!data.where.toLowerCase().startsWith('and'))
					data.where = `and ${data.where}`;
				where = `${where} ${data.where}`;
			}
		}
		return where;
	}
	static getSkipTake(data) {
		let skip = 0, take = 999999999; 
		if(data) {
			if(!data.page)
				data.page = 1;
			if(data.take)
				take = data.take;
			skip = (data.page - 1) * take;
		}

		return { skip, take };
	}
}

export {
	SQL
};