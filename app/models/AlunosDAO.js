var crypto = require('crypto');

function AlunosDAO(connection){
	this._connection = connection();
}

AlunosDAO.prototype.inserirAluno = function(aluno){
	console.log('cadastrar novo aluno',aluno);

	this._connection.open(function(erro,mongoclient){//primeiro parametro da funcao dcallback é sempre o erro/retorna o client
		
		mongoclient.collection("alunos",function(erro,collection){//permite manipular as coleções

            collection.insert(aluno);
			mongoclient.close();
		})

	});

}


AlunosDAO.prototype.buscarAlunos = function(aluno){
	
	this._connection.open(function(erro,mongoclient){

		mongoclient.collection("alunos",function(erro,collection){

            collection.find({nome:aluno.nome});
						
				
			mongoclient.close();
		})

	});

}



module.exports = function(){
	return AlunosDAO;
}