var mqtt = require('mqtt');
var mysql = require('mysql');

var mqtt_url = 'mqtt://pascal:pascal@127.0.0.1';

var mysql_login_details = {
	connectionLimit: 	10,
	host: 				'localhost',
	user: 				'admin_iot',
	password: 			'Sax243Gs',
	database: 			'admin_iot'
};

/*
SQL FOR CREATING MYSQL TABLE
----------------------------
	SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
	SET time_zone = "+00:00";

	CREATE TABLE IF NOT EXISTS `mqtt` (
	  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
	  `topic` varchar(50) NOT NULL,
	  `value` varchar(256) NOT NULL,
	  `created` datetime NOT NULL,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB  DEFAULT CHARSET=utf8;
*/

var pool = mysql.createPool(mysql_login_details);

var client = mqtt.connect(mqtt_url);

client.on('connect', function() {
	client.subscribe('#');
});

client.on('message', function(topic, msg, pkt) {
	pool.getConnection(function(err, conn) {
		var message = {
			'topic': 	topic,
			'value': 	value,
			'created':	new Date().toISOString().slice(0, 19).replace('T', ' ');
		}
		conn.query('INSERT INTO mqtt SET ?', message, function(err, res) {
			conn.release();
			if (err) throw err;
		});
	});
});