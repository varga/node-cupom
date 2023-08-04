'use strict'

const User = use("App/Models/User");

class UserController {

  async create ({request, response, view }) {
    
    const user = new User()

    user.name = request.input('name')
    user.email = request.input('email')
    user.password = request.input('password')

    try {
      await user.save();

      let texto = 'USUÁRIO CADASTRADO';
      return response.send(view.render('blank', {texto}));
    }catch(error){

      let texto = error;
      return response.send(view.render('blank', {texto}));

    }
    
  }

  async delete ({request, response, view }) {

    try {
    
      const user = await User.findByOrFail('email', request.input('email'));
      await user.delete();
      let texto = 'USUÁRIO EXCLUÍDO';
      return response.send(view.render('blank', {texto}));
    
    }catch(error){


      if(error.name === 'ModelNotFoundException'){
        
        let texto = 'USUÁRIO NÃO ENCONTRADO';
        return response.send(view.render('blank', {texto}));

      }
      
      let texto = error;
      return response.send(view.render('blank', {texto}));

    }
    
  }

  async login({request, response, auth, view}) {
  
    const email = request.input('email');
    const password = request.input('password');

    try {
      if (await auth.attempt(email, password)) {
        return response.redirect('/api/v2/sim/cupom/?x-kong-key=api_kong_key')
      }
    }
    catch (e) {
      console.log(e)

      let texto = 'LOGIN INVÁLIDO';
      return response.send(view.render('blank', {texto}));
    }

  }

  async logout({response, auth}) {
  
    await auth.logout();

    return response.redirect('/api/v2/sim/cupom/login?x-kong-key=api_kong_key');
  }

}

module.exports = UserController
