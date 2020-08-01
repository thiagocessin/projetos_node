module.exports.cadastro =  function(application, req, res){
	res.render('cadastro',{validacao:{}, dadosForm:{}});	
}

module.exports.cadastrar =  function(application, req, res){
	//body-parser
	var params = req.query;
	console.log('cadastrar',params);

	//req.assert('nome','Nome não pode ser vazio').notEmpty();
	//req.assert('usuario','Usuario não pode ser vazio').notEmpty();
	//req.assert('senha','Senha não pode ser vazio').notEmpty();
	//req.assert('casa','Casa não pode ser vazio').notEmpty();

	//var erros = req.validationErrors();

	/*if(erros){
		res.render('cadastro',{validacao:erros, dadosForm:dadosForm});
		return;
	}*/

	var connection = application.config.dbConnection;
	var AlunosDAO = new application.app.models.AlunosDAO(connection);
	//var JogoDAO = new application.app.models.JogoDAO(connection);

	AlunosDAO.inserirAluno(params);
	//JogoDAO.gerarParametros(dadosForm.usuario);

	//geração dos parametros


	res.send('Aluno cadastrado com sucesso!')
}
