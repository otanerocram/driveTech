import Pool from './database';

Pool.query(
    'SELECT * FROM `Device` WHERE `accountID` = "autosc"',
    function (err, results, fields) {
        console.log('results', results); // results contains rows returned by server
        // console.log('fields', fields); // fields contains extra meta data about results, if available
    },
);

// async function main() {
//     const connection = await MySQL.createConnection({
//         host: 'flotaprosegur.com',
//         user: 'gts',
//         password: 'YWd1aWxhZmxvdGFwcm9zZWd1cg==',
//         database: 'gtsss',
//         port: 2534,
//     });

//     const [rows] = await connection.execute(
//         'SELECT * FROM `Device` WHERE `accountID` = "autosc" limit 2',
//     );

//     console.log('The solution is: ', rows);

//     // close the connection
//     connection.end();
// }

// main().catch((error) => {
//     console.error('err', error);
// });
