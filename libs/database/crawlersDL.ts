import mysql, { ConnectionOptions } from 'mysql2';
import dotenv from 'dotenv';
import { getConfigValue } from '../common/configReader.js';

const dbConfig = getConfigValue("dbConfig");

dotenv.config();

const access: ConnectionOptions = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const connection = mysql.createConnection(access);

// const connection = mysql.createConnection({
//   host     : process.env.DB_HOST,
//   port     : process.env.DB_PORT || 3306,
//   user     : process.env.DB_USER,
//   password : process.env.DB_PASSWORD,
//     database : process.env.DB_NAME
// });


const SCHEMA = "automator";
const TABLE = "crawlers";

const closeConnection = () => {
    connection.end();
};

const getAll = (pageNumber = 1, pageSize = 10) => {
    return new Promise((resolve, reject) => {
        connection.query(`
            SELECT 
                id, name, url, configChain, status, status+0 as statusId, lastRun, isActive 
            FROM ${SCHEMA}.${TABLE} 
            WHERE isActive = 1`, function (error, results, fields) {
            if (error) reject(error);
            try {
                resolve(results);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    });
};

const get = id => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${SCHEMA}.${TABLE} WHERE id=${id} LIMIT 1`, function (error, result, fields) {
            if (error) reject(error);
            try {
                resolve(result[0]);
            }
            catch (ex) {
                console.error(ex);
            }
        });
    });
};

const add = crawler => {
    return new Promise((resolve, reject) => {
        // let data = {
        //     name: crawlerDetails.name,
        //     url: crawlerDetails.url,
        //     status: crawlerDetails.app,
        //     config: crawlerDetails.config
        // };
        connection.query(`INSERT INTO ${SCHEMA}.${TABLE} SET ?`, crawler, function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const updateStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${SCHEMA}.${TABLE} SET status = ? WHERE id = ?`, [status, id], function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const update = (id, crawler) => {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${SCHEMA}.${TABLE} SET ? WHERE id = ?`, [crawler, id], function (error, results, fields) {
            if (error) reject(error);
            resolve(results);
        });
    });
};

const remove = id => {
    return new Promise((resolve, reject) => {
        connection.query(
            `DELETE FROM ${SCHEMA}.${TABLE} WHERE id=${id}`,
            function (error, results, fields) {
                if (error) reject(error);
                resolve(results);
            }
        );
    });
};


export {
    closeConnection,
    getAll,
    get,
    add,
    updateStatus,
    update,
    remove
};