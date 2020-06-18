module.exports.index =  function(application, req, res){
	res.render('index',{validacao:{},usuario:{}});	
}

module.exports.autenticar =  function(application, req, res){
	
	var dadosForm = req.body;

	req.assert('usuario','Usuário ou senha inválidos').notEmpty();
	req.assert('senha','Usuário ou senha inválidos').notEmpty();
	
	var erros = req.validationErrors();

	if(erros){
		console.log('erros');
		res.render('index',{validacao:erros,usuario:dadosForm});
		return;
	}

	var connection = application.config.dbConnection;
	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);

	UsuariosDAO.autenticar(dadosForm, req, res);

	

}
