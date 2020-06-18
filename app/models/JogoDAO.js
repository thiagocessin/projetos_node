var ObjectId = require('mongodb').ObjectId;

function JogoDAO(connection){
	this._connection = connection();
}

JogoDAO.prototype.gerarParametros =  function(usuario){
	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		mongoclient.collection("jogo",function(erro,collection){//permite manipular as coleções
			collection.insert(
				{
					usuario:usuario,
					moeda:15,
					suditos:10,
					temor: Math.floor(Math.random() * 1000),
					sabedoria:Math.floor(Math.random() * 1000),
					comercio:Math.floor(Math.random() * 1000),
					magia:Math.floor(Math.random() * 1000)
				});


			mongoclient.close();
		})

	});

}

JogoDAO.prototype.iniciaJogo =  function(res,usuario,casa,msg){
	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		mongoclient.collection("jogo",function(erro,collection){//permite manipular as coleções
			collection.find({usuario:usuario}).toArray(function(erro,result){//find() retorna um cursor
				
				res.render('jogo',{
						img_casa:casa,
						jogo:result[0],
						msg:msg
					});		

				mongoclient.close();

			});
			
		})

	});


}

JogoDAO.prototype.acao =  function(acao){

	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		mongoclient.collection("acao",function(erro,collection){//permite manipular as coleções

			var date = new Date();
			var tempo = null;
			switch(parseInt(acao.acao)){
				case 1: tempo  = 1 * 60 * 60000;break;
				case 2: tempo  = 2 * 60 * 60000;break;
				case 3: tempo  = 5 * 60 * 60000;break;
				case 4: tempo  = 5 * 60 * 60000;break;
			}

			acao.acao_termina_em = date.getTime() + tempo;

			collection.insert(acao);
			
		});

		mongoclient.collection("jogo",function(erro,collection){//permite manipular as coleções
			//atualizando o numero de moedas na collection jogo

			var moedas=null;

			switch(parseInt(acao.acao)){
				case 1: moedas  = -2 * acao.quantidade;break;
				case 2: moedas  = -3 * acao.quantidade;break;
				case 3: moedas  = -1 * acao.quantidade;break;
				case 4: moedas  = -1 * acao.quantidade;break;
			}

			collection.update(
				{usuario:acao.usuario},
				{$inc:{moeda:moedas}}//faz um += do valor ja existente no banco
				);

			mongoclient.close();
		});

	});

	}
	
	JogoDAO.prototype.getAcoes =  function(res,usuario){
			this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
					mongoclient.collection("acao",function(erro,collection){//permite manipular as coleções
					
					var date = new Date();
					var momento_atual = date.getTime(); 

					collection.find({
									usuario:usuario,
									acao_termina_em:{$gt:momento_atual}})
									.toArray(function(erro,result){//find() retorna um cursor
														
							res.render('pergaminhos',{acoes:result});
							mongoclient.close();
							
						});
						
					});

	});
		

	}


	JogoDAO.prototype.revogarAcao =  function(res,_id){

		this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
					mongoclient.collection("acao",function(erro,collection){//permite manipular as coleções
					
					collection.remove({_id:ObjectId(_id)},function(erro,result){
						res.redirect('jogo?msg=D');
						mongoclient.close();

					});
					
						
			});

	});
	}



module.exports = function(){
	return JogoDAO;
}