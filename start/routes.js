'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(
() => {

  Route.get('/user/register', ({ view }) => {
    return view.render('register')
  }).middleware('auth');

  Route.get('/user/delete', ({ view }) => {
    return view.render('del-user')
  }).middleware('auth');

  Route.post('/user', 'UserController.create').middleware('auth');
  
  Route.post('/user/delete', 'UserController.delete').middleware('auth');

  Route.get('/login', ({ view }) => {
    return view.render('login')
  });

  Route.post('/login', 'UserController.login');

  Route.get('/logout', 'UserController.logout');

  Route.get('/', ({ view }) => {
    return view.render('generate-cupom')
  }).middleware('auth');

  Route.get('/mass', ({ view }) => {
    return view.render('mass')
  }).middleware('auth');

  Route.get('/delete', ({ view }) => {
    return view.render('del-cupom')
  }).middleware('auth');
  Route.post('generate', 'CupomController.generate').middleware('auth');
  Route.post('massgenerate', 'CupomController.mass').middleware('auth');
  Route.post('validate', 'CupomController.validate');
  Route.post('destroy', 'CupomController.delete').middleware('auth');

}).prefix('api/v1/cupom/');
