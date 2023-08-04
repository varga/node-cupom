'use strict'

var vogels = require('vogels');
vogels.AWS.config.loadFromPath('config.json');
const Joi = require('joi');
const Redis = use('Redis');
const response = use('Adonis/Src/Response');
const Papa = use('Papa');
const Helpers = use('Helpers');
const path = require('path');
const fs = require('fs');


var Cupom = vogels.define('cupom', {
    hashKey : 'cupom',
    timestamps : true,
    schema : {
      cupom : Joi.string(),
      de_para : Joi.string(),
      proposta_cadastro : Joi.string(),
      tabela : Joi.string(),
      data_inicial : Joi.date(),
      data_final : Joi.date(),
      criado_por : Joi.string(),
    }
  });

  var Logs = vogels.define('LogCupom', {
    hashKey : 'createdAt',
    timestamps : true,
      schema : {
        cupom : Joi.string(),
        proposta_cadastro : Joi.string(),
        status : Joi.string(),
      }
  });

class CupomController {

    async generate ({ request, auth, response, view }) {
        
        try {

            let dados = request.only(["cupom","de_para","proposta_cadastro", "tabela",  "data_inicial", "data_final"]);
            const user = await auth.getUser();
            const cupom = {cupom: dados.cupom.toUpperCase(), de_para : dados.de_para, proposta_cadastro: dados.proposta_cadastro, tabela: dados.tabela, data_inicial: dados.data_inicial, data_final: dados.data_final, criado_por: user.email};
            // console.log(cupom);
        
            Cupom.create(cupom, function (err, acc) {
                if(err) {
                    console.log('Oppss, ocorreu o erro: ', err);
                } else {
                    console.log('cupom criado em: ', acc.get('createdAt'));
                }
            });
    
            await Redis.hmset('cupoms', cupom.cupom, JSON.stringify(cupom));
    
            let texto = 'CUPOM CADASTRADO';
            return response.send(view.render('blank', {texto}));

          } catch (error) {
            let texto = 'ERRO AO CADASTRAR CUPOM - ' + error ;
            response.send(view.render('blank', {texto}))
          }
    }

    async delete ({ request, response, view }) {

        let cupom = request.input('cupom').toUpperCase();

        let dados = await Redis.hmget('cupoms', cupom);
        dados = dados.join();
        
        if(!dados){
            let texto = 'CUPOM NÃO ENCONTRADO';
            return response.send(view.render('blank', {texto}));
        }else{

            Cupom.destroy(cupom, function (err) {
            
                if(err) {
                    console.log('Oppss, ocorreu o erro: ', err);
                } else {
                    console.log('cupom deletado');
                }

            });

            await Redis.hdel('cupoms', cupom);

            let texto = 'CUPOM DELETADO';
            return response.send(view.render('blank', {texto}));

        }
    }

    async mass ({ request, response, auth, view }) {
        const validationOptions = {
            extnames: ['csv'],
        };

        const cuponsFile = request.file('cupons', validationOptions);

        await cuponsFile.move(Helpers.tmpPath('cupons'), {
            name: 'cupons.csv',
            overwrite: true,
        });

        if (!cuponsFile.moved()) {
            return cuponsFile.error();
        }
        const csv = path.resolve(Helpers.tmpPath('cupons'), 'cupons.csv');
        const csvString = fs.readFileSync(csv, 'utf8');
        let cupons = Papa.parse(csvString);
        cupons = cupons.data;

        for (var i = 1; i < cupons.length; i++) {

            try {

                const user = await auth.getUser();
                const dado = {cupom: cupons[i][0].toUpperCase(), de_para : cupons[i][1], proposta_cadastro: cupons[i][2], tabela: cupons[i][3], data_inicial: cupons[i][4], data_final: cupons[i][5], criado_por: user.email};

                Cupom.create(dado, function (err, acc) {
                    if(err) {
                        console.log('Oppss, ocorreu o erro: ', err);
                    } else {
                        console.log('cupom criado em: ', acc.get('createdAt'));
                    }
                });
    
                await Redis.hmset('cupoms', dado.cupom, JSON.stringify(dado));
    
            } catch (error) {
                let texto = 'ERRO AO CADASTRAR CUPOM - ' + error ;
                response.send(view.render('blank', {texto}))
            }
        
        }
        
        let texto = 'CUPONS CADASTRADOS';
        return response.send(view.render('blank', {texto}));
    }

    async validate({ request, response }) {

        let data = request.only(["cupom", "proposta_cadastro"]);
        let proposta_cadastro = data.proposta_cadastro;
        let codigo = data.cupom.toUpperCase();
        let log_cupom = data.cupom;

        // CONSULTA NO REDIS

        let dados = await Redis.hmget('cupoms', codigo);
        dados = dados.join();

        // ******* PROMISE PARA CONSULTA NO BANCO SEM O CACHE
        
        // let values;

        // function getvalues() {
        //     var promise = new Promise(function(resolve) {
        //       setTimeout(function() {
        //         Cupom.get(codigo,function (error, response) {
        //             if(error) {
        //                 console.log('Oppss, ocorreu o erro: ', err);
        //             } else {
        //                 values = response.attrs;
        //             }
        //             resolve(values);
        //         });
        //       });
        //     });
        //     return promise;
        //  }
         
        // var dados = getvalues().then(function(done) {
        //    return done;
        // });

        if(dados){
            dados = JSON.parse(dados);
            let data_inicial = dados.data_inicial;
            let data_final = dados.data_final;
            let de_para = dados.de_para;
            let tabela = dados.tabela;
            data_inicial = new Date(data_inicial);
            data_final = new Date(data_final);
            let today = new Date();

            if (today < data_inicial || today > data_final) {

                let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom expirado'}

                Logs.create(log, function (err, acc) {
                    if(err) {
                        console.log('Oppss, ocorreu o erro: ', err);
                    } else {
                        console.log('log criado em: ', acc.get('createdAt'));
                    }
                });

                return response.status(406).json({message: 'Cupom expirado'});

            }else{

                if (de_para == 0 && proposta_cadastro != dados.proposta_cadastro) {

                    let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom aplicado'}

                    Logs.create(log, function (err, acc) {
                        if(err) {
                            console.log('Oppss, ocorreu o erro: ', err);
                        } else {
                            console.log('log criado em: ', acc.get('createdAt'));
                        }
                    });

                    return response.status(200).json({message: 'Cupom aplicado', tabela: tabela});

                }else if (de_para == 0 && proposta_cadastro == dados.proposta_cadastro) {

                    let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom inválido'}

                    Logs.create(log, function (err, acc) {
                        if(err) {
                            console.log('Oppss, ocorreu o erro: ', err);
                        } else {
                            console.log('log criado em: ', acc.get('createdAt'));
                        }
                    });

                    return response.status(406).json({message: 'Cupom inválido'}); 
                }

                if (de_para == 1 && proposta_cadastro == dados.proposta_cadastro) {
                    
                    let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom aplicado'}

                    Logs.create(log, function (err, acc) {
                        if(err) {
                            console.log('Oppss, ocorreu o erro: ', err);
                        } else {
                            console.log('log criado em: ', acc.get('createdAt'));
                        }
                    });

                    return response.status(200).json({message: 'Cupom aplicado', tabela: tabela});

                } else if (de_para == 1 && proposta_cadastro != dados.proposta_cadastro) {

                    let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom inválido'}

                    Logs.create(log, function (err, acc) {
                        if(err) {
                            console.log('Oppss, ocorreu o erro: ', err);
                        } else {
                            console.log('log criado em: ', acc.get('createdAt'));
                        }
                    });

                    return response.status(406).json({message: 'Cupom inválido'}); 
                }
            }

        } else {
            
            let log = {cupom: log_cupom, proposta_cadastro : proposta_cadastro, status : 'Cupom inválido'}

            Logs.create(log, function (err, acc) {
                if(err) {
                    console.log('Oppss, ocorreu o erro: ', err);
                } else {
                    console.log('log criado em: ', acc.get('createdAt'));
                }
            });

            return response.status(406).json({message: 'Cupom inválido'});
        }
    }
       
}

module.exports = CupomController

