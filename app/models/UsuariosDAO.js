var crypto = require('crypto');

function UsuariosDAO(connection){
	this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
	console.log('cadastrar novo aluno');

	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		
		mongoclient.collection("usuarios",function(erro,collection){//permite manipular as coleções

			var senha_criptografada = crypto.createHash('md5').update(usuario.senha).digest('hex');
			usuario.senha = senha_criptografada;
			
			collection.insert(usuario);
			mongoclient.close();
		})

	});

}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		mongoclient.collection("usuarios",function(erro,collection){//permite manipular as coleções
			
			var senha_criptografada = crypto.createHash('md5').update(usuario.senha).digest('hex');
			usuario.senha = senha_criptografada;

			collection.find(usuario).toArray(function(erro,result){//find() retorna um cursor

				if (result[0] != undefined) {
				//se o usuário for válido, criamos a variável de sessão
				// a variável de sessão existe enquanto o navegador estiver aberto

					req.session.autorizado = true;
					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;

				}
				if(req.session.autorizado){
					res.redirect('jogo');
				}else{
					res.render('index',{validacao:[{msg:'Usuário ou senha inválidos'}],usuario:{usuario}});
				}

			});
			mongoclient.close();
		})

	});

}

module.exports = function(){
	return UsuariosDAO;
}