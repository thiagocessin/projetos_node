//importar o mongodb
var mongo = require('mongodb');

var connMongoDB = function(){
		var db = new mongo.Db(
		'got', // database
		 new mongo.Server('localhost',27017,{}),//objeto de conexão do server(endereço do servidor, porta de conexao, configurações do server)
		 {}//configurações opcionais
	);

	return db;
}

module.exports = function(){
	return connMongoDB;
}