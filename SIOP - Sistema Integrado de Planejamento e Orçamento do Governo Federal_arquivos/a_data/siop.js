'use strict';

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
};
String.prototype.contains = function(e) {
	return this.indexOf(e) > -1;
};
Array.prototype.select = function(f) {
	var result = [];
	for (var i = 0; i < this.length; i++) {
		if (f(this[i])) result.push(this[i]);
	};
	return result;
};
Array.prototype.detect = function(f) {
	for (var i = 0; i < this.length; i++) {
		if (f(this[i])) return this[i];
	};
	return undefined;
};
Array.prototype.sum = function(f) {
	var result = 0;
	var value;
	for (var i = 0; i < this.length; i++) {
		value = f(this[i]);
		if (typeof value !== 'undefined') result += value;
	};
	return result;
};
Array.prototype.contains = function(f) {
	for (var i = 0; i < this.length; i++) {
		if (f(this[i])) return true;
	};
	return false;
};
Array.prototype.addAll = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		this.push(arr[i]);
	};
};
Array.prototype.remove = function(e) {
	this.splice(this.indexOf(e), 1);
};
Array.prototype.removeAll = function(f) {
	var arr = this;
	this.select(f).forEach(function(e) {
		arr.remove(e);
	});
};
Number.prototype.between = function(a, b) {
	let min = Math.min.apply(Math, [a, b]);
	let max = Math.max.apply(Math, [a, b]);
  	return this > min && this < max;
}
Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
};
Function.method('curry', function() {
	var slice = Array.prototype.slice,
	args = slice.apply(arguments),
	that = this;
	return function() {
		return that.apply(null, args.concat(slice.apply(arguments)));
	};
});

var siop = { spinnerCount: 0 };

siop.module = angular.module('MainModule', ['ngResource', 'ngRoute']);

siop.module.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        siop.spinnerCount++;
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

siop.module.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            siop.spinnerCount--;
            return response;
        }, function (response) {
            siop.spinnerCount--;
            return $q.reject(response);
        });
    };
});

siop.module.factory('Contexto', function($location) {
	return /http(?:s)?:\/\/.+(?::\d+)?\/(.+)\/.+/.exec($location.absUrl())[1];
});

siop.module.factory('Cenario', function($resource, Contexto) {
	return $resource('/' + Contexto + '/json.do/recursos/272/cenarios/:id/:metodo/:exercicio?:sufixo', {},
		{
			valoresPorGrupoReceitasFonteadas: { method: 'GET', params: { metodo: 'valoresPorGrupoReceitasFonteadas' }, isArray: false },
			save: { method: 'POST', params: { metodo: 'valoresPorGrupoReceitasFonteadas' }, isArray: true }
		});
});

siop.module.factory('CenarioGrupoFonteado', function($resource, Contexto) {
	return $resource('/' + Contexto + '/json.do/recursos/272/cenarios/:id/valoresPorGrupoReceitasFonteadas/:grupoReceitaFonteada/:metodo/:exercicio?origem=:origem', {},
		{
			valores: { method: 'GET', params: { metodo: 'valores' }, isArray: false },
			verificarAjusteFonteado: { method: 'POST', params: { metodo: 'verificarAjusteFonteado' }, isArray: false },
			verificarAjusteNaoFonteado: { method: 'POST', params: { metodo: 'verificarAjusteNaoFonteado' }, isArray: false }
		});
});

siop.module.factory('OrigensDeDados', function($resource, Contexto) {
	return $resource('/' + Contexto + '/json.do/recursos/272/origensDeDados/:nome/:metodo', {},
		{
			valores: { method: 'GET', params: { metodo: 'valoresPorGrupoReceitasFonteadas' }, isArray: false }
		});
});

siop.module.factory('CenarioN', function($resource, Contexto) {
	return $resource('/' + Contexto + '/json.do/recursos/272/cenariosN/:id', {},
		{
			get: { method: 'GET', params: {}, isArray: false }
		});
});

siop.module.directive('siopTable', function($timeout) {
	return {
		compile: function(tElement, tAttrs) {
			var tr;
			var trs = tElement.find('tr');
			for (var i = 0; i < trs.length; i++) {
				if (typeof angular.element(trs[i]).attr('ng-repeat') !== 'undefined') {
					tr = angular.element(trs[i]);
					break;
				}
			};
			var nextElement = tElement.next();
			if (typeof nextElement !== 'undefined' && nextElement.prop('nodeName') === 'SIOP-PAGINATOR') {
				var table_id = Math.floor((Math.random() * 10000000000) + 1);
				tElement.data('ng-repeat', tr.attr('ng-repeat'));
				tElement.data('table_id', table_id);
				tr.attr('ng-repeat', tr.attr('ng-repeat') + " | paginated:" + table_id);
			}
			return function(scope, element, attrs) {
				element.prepend('<caption>' + attrs.siopTable + '</caption>');
				attrs.$set('class', 'siop_tabela');
				attrs.$set('cellpadding', '0');
				attrs.$set('cellspacing', '0');
			};
		}
	};
});

siop.module.directive('siopTr', function() {
	return function(scope, element, attrs) {
		attrs.$set('class', 'siop_tabela_linha_sublinhada_');
		attrs.$set('onmouseover', "this.className='siop_tabela_linha_ativa'" );
		attrs.$set('onmouseout', "this.className='siop_tabela_linha_sublinhada_'");
	};
});

siop.module.directive('siopTableCheck', function() {
	return {
		compile: function(tElement, tAttrs) {
			if (tElement.prop('nodeName') === 'TH') {
				tAttrs.$set('class', 'siop_tabela_coluna_check');
				tElement.append('<input type="submit" title="Selecionar todos os itens abaixo" class="siop_formulario_botao_selecionar_todos" value="" />');
			} else if (tElement.prop('nodeName') === 'TD') {
				tElement.append('<input class="siop_formulario_checkbox" type="checkbox" value="checkbox_02" ng-model="'+ tAttrs.siopTableCheck + '"/>');
			}
			return function(scope, element, attrs) {
			};
		}
	};
});

siop.module.directive('siopPaginator', function(Contexto) {
	return {
		templateUrl: '/' + Contexto + '/framework/client/templates/paginator.html',
		restrict: 'E',
		replace: true,
		scope: true,
		controller: PaginatorCtrl
	};
});

siop.module.directive('onEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keypress", function(event) {
			if (event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.onEnter);
				});
				event.preventDefault();
			}
		});
	};
});

siop.module.filter('paginated', function() {
	return function(input, table_id) {
		if (typeof input === 'undefined' || typeof table_id === 'undefined' || typeof this.paginator_info === 'undefined') return input;
		var paginatorScope = this.paginator_info[table_id];
		if (paginatorScope.itensPorPagina === 'undefined') return input;
		var start = (paginatorScope.paginaAtual - 1) * parseInt(paginatorScope.itensPorPagina);
		return input.slice(start, start + parseInt(paginatorScope.itensPorPagina));
	};
});

siop.mostraMensagemDeErro = function(mensagemDeErro) {
	jQuery('#form\\:mensagemErroContainer2').css('display', 'block');
	jQuery('#mensagemErro2').text(mensagemDeErro);
}

siop.mostraMensagemDeAlerta = function(mensagemDeAlerta) {
	jQuery('#form\\:mensagemAlertaContainer2').css('display', 'block');
	jQuery('#mensagemAlerta2').text(mensagemDeAlerta);
}

function CenarioAjustesCtrl($scope, $window, Cenario, CenarioGrupoFonteado, 
		OrigensDeDados, CenarioN) {
	$scope.filtroDeCodigoSelecionado = '?000';
	$scope.colunasAdicionadas = [];
	$scope.colunasEscondidas = [];
	$scope.colunasAdicionaisSelecionadas = {};
	$scope.mostrandoGrupoDeReceita = true;
	$scope.origens = {};
	var _valoresAgrupados; // variável que armazena os valores agrupados carregados
	var _origensAdicionadas = [];
	var _origensRemovidas = [];
	var cacheDeValoresFilhos = {};
	function carregaValoresAgrupados () {
		$scope.mensagemDeAlerta = "Carregando...";
		var s = new Date();
		var valoresAgrupadosSelecionadosAnteriores = 
			$scope.valoresAgrupadosSelecionados;
		_origensAdicionadas = [];
		_origensRemovidas = [];
 		Cenario.valoresPorGrupoReceitasFonteadas(
 			{ id: $scope.id, exercicio: $scope.exercicioSelecionado }, 
 			function (resultado) {
 				if (resultado.hasOwnProperty("mensagem")) {
					siop.mostraMensagemDeErro(resultado.mensagem);
					return;
				}
 				_valoresAgrupados = resultado.valores;
 				/*
 				var origens = [];
 				_valoresAgrupados.forEach(function(va) {
 					if (typeof va.origem !== 'undefined' && 
 							origens.indexOf(va.origem) === -1) {
 						origens.push(va.origem);
 					}
 				});
				*/
				$scope.colunasAdicionadas = [];
				$scope.origens = {};
				$scope.origensSelecionadas = undefined;
				cacheDeValoresFilhos = {};
 				$scope.configuracoesPertencentesAMaisDeUmGrupoFonteado = 
 					resultado.configuracoesPertencentesAMaisDeUmGrupoFonteado;
	 			_valoresAgrupados.forEach(function (va) {
					va.metaCalculada = metaCalculada;
					if (valoresFilhosDe(va).length === 0) {
						va._valoresNaoFonteados = va.valoresNaoFonteados || [];
						va._valoresFonteados = va.valoresFonteados || [];
						associarFuncoesAsInstanciasDosValoresAnaliticos(va);
						va.valores = valoresNaoFonteadosAssociadosAoGrupoReceitaFonteado;
						va.valoresFonteados = 
							valoresFonteadosAssociadosAoGrupoReceitaFonteado;
						va.isValoresCarregados = function () {
							return typeof this._valoresNaoFonteados !== 'undefined' || 
								typeof this._valoresFonteados !== 'undefined';
						};
					}
				});
				if (typeof valoresAgrupadosSelecionadosAnteriores !== 'undefined') {
					$scope.valoresAgrupadosSelecionados = undefined;
					valoresAgrupadosSelecionadosAnteriores.forEach(function (va) {
						$scope.selecionarValorAgrupado(
								_valoresAgrupados.detect(function (eachVa) {
							return eachVa.grupoReceitaFonteada.grupoReceitaFonteada === 
								va.grupoReceitaFonteada.grupoReceitaFonteada;
						}));
					});
					valoresAgrupadosSelecionadosAnteriores = undefined;
				}
				if (typeof resultado.origens !== 'undefined') {
					resultado.origens.forEach(function (o) {
						$scope.colunasAdicionadas.push(o.origem);
						$scope.origens[o.origem] = o;
 						_valoresAgrupados.forEach(function (va) {
 							if (typeof va.origem !== 'undefined' && va.origem === o.origem) {
 								$scope.selecionarOrigem(o.origem, va, true, true);
 							}
 						});
					});
				}
				console.log((new Date() - s)/1000);
 			});
	}
	// funções a serem associadas às instâncias de valores agrupados
	function metaCalculada () {
		if (!isEmpty(this.meta) && 
					!$scope.isDefined($scope.origemDoValorAgrupado(this))) {
			return parseFloat(this.meta);
		}
		var filhos = valoresFilhosDe(this);
		if (filhos.length === 0) {
			var resultado = $scope.somatorioDeMetasDosFilhos(this);
			if (typeof resultado === 'undefined') {
				return $scope.valorSelecionado(this);
			}
			return resultado;
		}
		return filhos.sum(function (f) { return f.metaCalculada() });
	}
	function valoresNaoFonteadosAssociadosAoGrupoReceitaFonteado () {
		if (typeof this._valoresNaoFonteados !== 'undefined') {
			return this._valoresNaoFonteados;
		}
		carregaValoresAnaliticos(this);
	}
	function valoresFonteadosAssociadosAoGrupoReceitaFonteado () {
		if (typeof this._valoresFonteados !== 'undefined') {
			return this._valoresFonteados;
		}
		carregaValoresAnaliticos(this);
	}
	// função de apoio para carregar os valores analíticos de cada valor agrupado
	function carregaValoresAnaliticos(valorAgrupado) {
		if (typeof valorAgrupado._valoresAnaliticos !== 'undefined') return;
		$scope.mensagemDeAlerta = "Carregando...";
		var codigoDoGrupoFonteado = valorAgrupado.grupoReceitaFonteada.grupoReceitaFonteada;
		if (codigoDoGrupoFonteado.trim().length === 0) codigoDoGrupoFonteado = "0";
		var origemSelecionada = $scope.origemDoValorAgrupado($scope.valorAgrupadoSelecionado());
		valorAgrupado._valoresAnaliticos = CenarioGrupoFonteado.valores(
			{ id: $scope.id, exercicio: $scope.exercicioSelecionado, grupoReceitaFonteada: codigoDoGrupoFonteado, origem: origemSelecionada }, 
			function(resultado) {
				if (resultado.hasOwnProperty("mensagem")) {
					siop.mostraMensagemDeErro(resultado.mensagem);
					return;
				}
				valorAgrupado._valoresNaoFonteados = resultado.valoresNaoFonteados;
				valorAgrupado._valoresFonteados = resultado.valoresFonteados;
				if (typeof origemSelecionada !== 'undefined') {
					var valoresExcedentes = [];
					$scope.origens[origemSelecionada].valoresFonteados = resultado.valoresFonteadosDaOrigem;
					associarValoresDaOrigemAosValoresFonteados(valorAgrupado, true);
				}
				associarFuncoesAsInstanciasDosValoresAnaliticos(valorAgrupado);
				if (valorAgrupado.proporcionalizarSaldo) {
					$scope.proporcionalizarGlobal(valorAgrupado);
					valorAgrupado.proporcionalizarSaldo = undefined;
				}
				valorAgrupado.desfazerAjustes = undefined;
			});
	}
	function associarFuncoesAsInstanciasDosValoresAnaliticos(valorAgrupado) {
		//funções a serem associadas às instâncias de valores analíticos
		var metaAnaliticaCalculada = function() {
			if (!isEmpty(this.meta)) return parseFloat(this.meta);
			var linhaAnaliticaNaoFonteada = this;
			var valorAgrupado = this.valorAgrupado;
			if ($scope.isDefined($scope.origemDoValorAgrupado(valorAgrupado)) && isEmpty(valorAgrupado.meta)) {
				var vv = $scope.origens[$scope.origemDoValorAgrupado(valorAgrupado)].valoresFonteados;
				if (typeof vv === 'undefined') return this.valor;
				var valoresDaOrigemAssociadosAaLinhaAnaliticaNaoFonteada = function(v) { 
					return typeof v.valorAnaliticoFonteado !== 'undefined' 
							&& v.valorAnaliticoFonteado.cenarioValorId === linhaAnaliticaNaoFonteada.id;
				};
				//return vv.select(valoresDaOrigemAssociadosAaLinhaAnaliticaNaoFonteada).sum(function(v) { return v.valor });
				return this.valoresFonteados.sum(function(v) { 
					if (typeof v.valorFonteadoDaOrigem === 'undefined') return 0;
					return v.valorFonteadoDaOrigem.valor;
				});
			}
			return this.valor;
		}
		var metaAnaliticaFonteadaCalculada = function() {
			if (!isEmpty(this.meta)) return parseFloat(this.meta);
			if ($scope.isDefined($scope.origemDoValorAgrupado(this.valorAgrupado)) && isEmpty(this.valorAgrupado.meta) && typeof this.descartarValorDaOrigem === 'undefined') {
				return $scope.valorFonteadoDaOrigem($scope.origemDoValorAgrupado(this.valorAgrupado), this);
			}
			return this.valor;
		}
		if (typeof valorAgrupado._valoresNaoFonteados !== 'undefined') {
			var mapa = {};
			valorAgrupado._valoresNaoFonteados.forEach(function(vnf) {
				mapa[vnf.id] = vnf;
			});
			valorAgrupado._valoresFonteados.forEach(function(vf) {
				var vnf = mapa[vf.cenarioValorId];
				if (typeof vnf === 'undefined') return;
				if (typeof vnf.valoresFonteados === 'undefined') vnf.valoresFonteados = [];
				if (!vnf.valoresFonteados.contains(function(vf_) { return vf_.id === vf.id })) {
					vnf.valoresFonteados.push(vf);
				}
			});
		}
		var f = function(v, fonteado) {
			v.metaOriginal = v.meta;
			if (fonteado) {
				v.metaCalculada = metaAnaliticaFonteadaCalculada;
			} else {
				v.metaCalculada = metaAnaliticaCalculada;
			}
			if (valorAgrupado.desfazerAjustes) v.meta = undefined;
			v.valorAgrupado = valorAgrupado;
		}
		var f1 = function(v) { f(v, false) };
		var f2 = function(v) { f(v, true) };
		if (typeof valorAgrupado._valoresNaoFonteados !== 'undefined') {
			valorAgrupado._valoresNaoFonteados.forEach(f1);
		}
		if (typeof valorAgrupado._valoresFonteados !== 'undefined') {
			valorAgrupado._valoresFonteados.forEach(f2);
		}
	}
	$scope.salvar = function() {
		if (isEmpty($scope.justificativa.trim())){
			siop.mostraMensagemDeErro(
				'Para salvar os ajustes, a justificativa deve ser preenchida');
			return;
		}
		var valores = [];
		_valoresAgrupados.forEach(function (v) {
			if (v.id < 0) return;
			var valorAaSalvar = { 
				grupoReceitaFonteada: v.grupoReceitaFonteada.grupoReceitaFonteada };
			if (!isEmpty(v.meta)) {
				valorAaSalvar.meta = v.meta;
			}
			if (!isEmpty(v.desfazerAjustes)) {
				valorAaSalvar.desfazerAjustes = true;
			}
			if (!isEmpty(v.proporcionalizarSaldo)) {
				valorAaSalvar.proporcionalizarSaldo = true;
			}
			$scope.colunasAdicionadas.forEach(function(c) {
				if ($scope.temOrigemPropriaSelecionada(c, v)) {
					valorAaSalvar.origem = c;
				}
			});
			if (valoresFilhosDe(v).length === 0 && v.isValoresCarregados()) {
				var testIfChanged = function(v) {
					if (isEmpty(v.metaOriginal) !== isEmpty(v.meta)) {
						return true;
					}
					if (!isEmpty(v.meta) && parseFloat(v.meta) !== v.metaOriginal) {
						return true;
					}
					return false;
				}
				var fnAdicionaValorComMeta = function(colecao, v) {
					if (testIfChanged(v) || 
							typeof valorAaSalvar.origem !== 'undefined') {
						if (typeof valorAaSalvar[colecao] === 'undefined') {
							valorAaSalvar[colecao] = [];
						}
						if (v.ajuste) {
							if (testIfChanged(v)) {
								if (colecao === 'valoresNaoFonteados') {
									valorAaSalvar[colecao].push({ 
										id: v.id, 
										naturezaReceita: v.naturezaReceita, 
										subnatureza: v.subnatureza, 
										unidadeRecolhedora: v.unidadeRecolhedora, 
										meta: parseFloat(v.meta), 
										ajuste: true });
								} else {
									valorAaSalvar[colecao].push({ 
										id: v.id, 
										naturezaReceita: v.naturezaReceita, 
										orgao: v.orgao, 
										fonte: v.fonte, 
										esfera: v.esfera, 
										meta: parseFloat(v.meta), 
										ajuste: true });
								}
							}
						} else {
							var meta = 
								typeof v.meta === 'undefined' ? undefined : parseFloat(v.meta);
							if (colecao === 'valoresNaoFonteados') {
								if (testIfChanged(v)) {
									valorAaSalvar[colecao].push({ id: v.id, meta: meta });
								}
							} else {
								var valorInicial = 
									$scope.valorFonteadoDaOrigem(valorAaSalvar.origem, v);
								if (typeof valorAaSalvar.origem !== 'undefined') {
									if (typeof valorInicial === 'undefined') valorInicial = 0;
									if (v.valorDaOrigem) {
										valorAaSalvar[colecao].push({ 
											id: v.id, 
											naturezaReceita: v.naturezaReceita, 
											orgao: v.orgao, 
											fonte: v.fonte, 
											esfera: v.esfera, 
											valorInicial: valorInicial, 
											ajuste: true });
										return;
									}
								}
								valorAaSalvar[colecao].push({ 
									id: v.id, meta: meta, valorInicial: valorInicial });
							}
						}
					}
				}
				v.valores().forEach(
					fnAdicionaValorComMeta.curry('valoresNaoFonteados'));
				v.valoresFonteados().forEach(
					fnAdicionaValorComMeta.curry('valoresFonteados'));
			}
			if (!isEmpty(valorAaSalvar.meta) || 
					!isEmpty(valorAaSalvar.desfazerAjustes) || 
					!isEmpty(valorAaSalvar.origem) || 
					typeof valorAaSalvar.valoresNaoFonteados !== 'undefined' || 
					typeof valorAaSalvar.valoresFonteados !== 'undefined') {
				valores.push(valorAaSalvar);
			}
		});
		var origens;
		if (!isEmpty($scope.colunasAdicionadas)) {
			origens = {};
			$scope.colunasAdicionadas.forEach(function (o) {
				origens[o] = [];
				$scope.origens[o].valoresFonteados.forEach(function (vf) {
					origens[o].push({ 
						grupoReceitaFonteada: vf.grupoReceitaFonteada, 
						naturezaReceita: vf.naturezaReceita, 
						orgao: vf.orgao, 
						fonte: vf.fonte, 
						esfera: vf.esfera, 
						valor: vf.valor });
				});
			});
		}
		$scope.mensagemDeAlerta = "Salvando...";
		Cenario.save({ id: $scope.id, exercicio: $scope.exercicioSelecionado }, 
			[ { justificativa: $scope.justificativa, 
					valores: { origens: origens, valores: valores } } ], 
			function (resultado) {
				if (resultado.length > 0 && resultado[0].hasOwnProperty("mensagem")) {
					siop.mostraMensagemDeErro(resultado[0].mensagem);
					return;
				}
				if (valores.length > 0) {
					carregaValoresAgrupados();
				}
			}
		);
	}
	$scope.$watch('id', function (newValue, oldValue) {
		carregaValoresAgrupados();
	});
	$scope.$watch('exercicioSelecionado', function (newValue, oldValue) {
		if (newValue !== oldValue) carregaValoresAgrupados();
		jQuery('#form\\:cadastro\\:ajustes\\:cenarioAjustesExercicio').val(
			newValue);
	});
	$scope.showSpinner = function () {
		return siop.spinnerCount > 0;
	}
	function escondeMensagemDeErro () {
		jQuery('#form\\:mensagemErroContainer2').css('display', 'none');
	}
	function escondeMensagemDeAlerta () {
		jQuery('#form\\:mensagemAlertaContainer2').css('display', 'none');
	}
	$scope.$watch('showSpinner()', function (newValue) {
		if (newValue) escondeMensagemDeErro();
		jQuery('#form\\:mensagemAlertaContainer2').css('display', 
			newValue ? 'block' : 'none');
		jQuery('#document\\:body').css('cursor', newValue ? 'wait' : 'auto');
		jQuery('#waitingBackgroundOperation').css('visibility', newValue ? 'visible' : 'hidden');
		jQuery('#mensagemAlerta2').text($scope.mensagemDeAlerta);
	});
	$scope.filtrosDeCodigo = function () {
		var resultado = [];
		resultado.push("?000");
		resultado.push("??00");
		resultado.push("???0");
		resultado.push("*");
		if (typeof _valoresAgrupados !== 'undefined') {
			_valoresAgrupados.forEach(function (v) {
				if (/^\d000+$/.test(v.grupoReceitaFonteada.grupoReceitaFonteada)) {
					resultado.push(
						v.grupoReceitaFonteada.grupoReceitaFonteada.charAt(0) + '*');
				}
			});
		}
		return resultado;
	}
	$scope.filtroDeValores = function (v) {
		if ($scope.filtroDeCodigoSelecionado === '*') return true;
		var regex = 
			new RegExp('^' + $scope.filtroDeCodigoSelecionado.replace(/\?/g, '\\d').
				replace(/\*/, '\\d*').replace(/0$/, '0+') + '$');
		return v.grupoReceitaFonteada.grupoReceitaFonteada.match(regex);
	}
	var filtroDeCodigoSelecionadoAnterior = null;
	$scope.selecionarValorAgrupado = function (valorAgrupado) {
		escondeMensagemDeErro();
		if (typeof $scope.valoresAgrupadosSelecionados === 'undefined') {
			$scope.valoresAgrupadosSelecionados = [];
		}
		$scope.valoresAgrupadosSelecionados.push(valorAgrupado);
		if (typeof valorAgrupado !== 'undefined' && valorAgrupado !== null) {
			if (filtroDeCodigoSelecionadoAnterior === null) {
				filtroDeCodigoSelecionadoAnterior = $scope.filtroDeCodigoSelecionado;
			}
			$scope.filtroDeCodigoSelecionado = '*';
		}
		$scope.editandoValoresAgrupados = false;
		$scope.editandoValoresNaoFonteados = false;
		$scope.editandoValoresFonteados = false;
	}
	$scope.removerValorAgrupadoSelecionado = function (valorAgrupado) {
		escondeMensagemDeErro();
		var index = $scope.valoresAgrupadosSelecionados.indexOf(valorAgrupado);
		$scope.valoresAgrupadosSelecionados.splice(index, 
			$scope.valoresAgrupadosSelecionados.length - index);
		if ($scope.valoresAgrupadosSelecionados.length === 0) {
			$scope.filtroDeCodigoSelecionado = filtroDeCodigoSelecionadoAnterior;
			filtroDeCodigoSelecionadoAnterior = null;
		}
		$scope.editandoValoresAgrupados = false;
		$scope.editandoValoresNaoFonteados = false;
		$scope.editandoValoresFonteados = false;
	}	
	$scope.valoresAgrupados = function() {
		$scope.mostrandoGrupoDeReceita = true;
		if (typeof _valoresAgrupados === 'undefined') return [];
		if (typeof $scope.valorAgrupadoSelecionado() !== 'undefined') {
			var resultado = valoresFilhosDe($scope.valorAgrupadoSelecionado());
			$scope.mostrandoGrupoDeReceita = (resultado.length > 0);
			return resultado;
		}
		return _valoresAgrupados;
	}
	$scope.valorAgrupadoSelecionado = function() {
		if (typeof $scope.valoresAgrupadosSelecionados === 'undefined') {
			return undefined;
		}
		if ($scope.valoresAgrupadosSelecionados.length === 0) return undefined;
		return $scope.valoresAgrupadosSelecionados[
			$scope.valoresAgrupadosSelecionados.length - 1];
	}
	$scope.atualizaNaturezaSelecionada = function (n) {
		escondeMensagemDeErro();
		$scope.naturezaSelecionada = n;
	}
	$scope.filtraPorNatureza = function (linha) {
		return typeof $scope.naturezaSelecionada === 'undefined' || 
			linha.naturezaReceita === $scope.naturezaSelecionada;
	}
	function isEmpty(val) {
		if (typeof val === 'undefined' || val === null) return true;
		if (typeof val === 'string' && (val === '' || val.trim() === '')) {
			return true;
		}
		return false;
	}
	$scope.filtraPorFiltrosNaoFonteados = function (linha) {
		if (!isEmpty($scope.filtroNaturezaReceitaNaoFonteada) && 
			linha.naturezaReceita.indexOf(
				$scope.filtroNaturezaReceitaNaoFonteada) === -1) {
			return false;
		}
		if (!isEmpty($scope.filtroSubnaturezaNaoFonteada) && 
			linha.subnaturezaReceita.indexOf(
				$scope.filtroSubnaturezaNaoFonteada) === -1) {
			return false;
		}
		if (!isEmpty($scope.filtroUnidadeRecolhedoraNaoFonteada) && 
			linha.unidadeRecolhedora.indexOf(
				$scope.filtroUnidadeRecolhedoraNaoFonteada) === -1) {
			return false;
		}
		return true;
	}
	$scope.filtraPorFiltrosFonteados = function (linha) {
		if (!isEmpty($scope.filtroNaturezaReceitaFonteada) && 
			!linha.naturezaReceita.contains($scope.filtroNaturezaReceitaFonteada)) {
			return false;
		}
		if (!isEmpty($scope.filtroOrgaoFonteada) && 
				!linha.orgao.contains($scope.filtroOrgaoFonteada)) {
			return false;
		}
		if (!isEmpty($scope.filtroFonteFonteada) && 
				!linha.fonte.contains($scope.filtroFonteFonteada)) {
			return false;
		}
		if (!isEmpty($scope.filtroEsferaFonteada) && 
				!linha.esfera.contains($scope.filtroEsferaFonteada)) {
			return false;
		}
		return true;
	}
	$scope.origemDoValorAgrupado = function(valorAgrupado) {
		if (typeof valorAgrupado === 'undefined' || 
			valorAgrupado.grupoReceitaFonteada === 'undefined') return undefined;
		if (typeof $scope.origensSelecionadas === 'undefined') return undefined;
		var os = $scope.origensSelecionadas;
		for (var i = 0; i < os.length; i++) {
			if (os[i].indexOf(
					valorAgrupado.grupoReceitaFonteada.grupoReceitaFonteada + "|") 
						=== 0) {
				return os[i].split(/\|/)[1];
			}
		}
	}
	$scope.temMetaInformada = function(linha, verificaFilhos) {
		if (typeof linha === 'undefined') return false;
		if (!isEmpty(linha.meta)) return true;
		if (!verificaFilhos) return false;
		var filhos = valoresFilhosDe(linha);
		if (filhos.length === 0) {
			if (linha.isValoresCarregados()) {
				var fnNaoVazio = function(v) { return !isEmpty(v.meta) };
				if (linha.valores().contains(fnNaoVazio)) return true;
				if (linha.valoresFonteados().contains(fnNaoVazio)) return true;
			} else {
				return !isEmpty(linha.metaAnalitica);
			}
		} else {
			for (var i = 0; i < filhos.length; i++) {
				if ($scope.temMetaInformada(filhos[i], verificaFilhos)) return true;
			}
		}
		return false;
	}
	$scope.temAlgumaMetaInformada = function() {
		if (typeof _valoresAgrupados === 'undefined') return false;
		if (typeof $scope.valorAgrupadoSelecionado() === 'undefined') {
			var regex = new RegExp(/^\d00/);
			for (var i = 0; i < _valoresAgrupados.length; i++) {
				if (_valoresAgrupados[i].grupoReceitaFonteada.grupoReceitaFonteada.match(regex) && $scope.temMetaInformada(_valoresAgrupados[i])) {
					return true;
				}
			};
			return false;
		} else {
			return $scope.temMetaInformada($scope.valorAgrupadoSelecionado());
		}
	}
	$scope.algumAjusteIncompleto = function() {
		if (typeof _valoresAgrupados === 'undefined') return false;
		if (typeof $scope.valorAgrupadoSelecionado() === 'undefined') {
			var regex = new RegExp(/^\d00/);
			for (var i = 0; i < _valoresAgrupados.length; i++) {
				if (_valoresAgrupados[i].grupoReceitaFonteada.grupoReceitaFonteada.match(regex) 
						&& $scope.ajusteIncompleto(_valoresAgrupados[i])) {
					return true;
				}
			};
			return false;
		} else {
			return $scope.ajusteIncompleto($scope.valorAgrupadoSelecionado());
		}
	}
	var metaOuValor = function (v) {
		if (isEmpty(v.meta)) {
			return v.valor;
		} else {
			return parseFloat(v.meta);
		}
	};
	$scope.ajusteIncompleto = function (linha) {
		if (typeof linha === 'undefined') return false;
		var metaCalculada = linha.metaCalculada();
		if (typeof metaCalculada === 'undefined' || metaCalculada === null) {
			return false;
		}
		var filhos = valoresFilhosDe(linha);
		if (filhos.length === 0 && !linha.isValoresCarregados() && 
				typeof linha.metaAnalitica === 'undefined') {
			return typeof linha.meta !== 'undefined' && 
				linha.valor != parseFloat(linha.meta);
		}
		if (filhos.length > 0) {
			for (var i = 0; i < filhos.length; i++) {
				if ($scope.ajusteIncompleto(filhos[i])) {
					return true;
				}
			};
		}
		var soma = $scope.somatorioDeMetasDosFilhos(linha);
		return Math.round(soma * 100) !== Math.round(linha.metaCalculada() * 100);
	}
	$scope.somatorioDeMetasDosFilhos = function (linha) {
		if (typeof linha === 'undefined') return undefined;
		var soma;
		var filhos = valoresFilhosDe(linha);
		if (filhos.length === 0) {
			if (linha.isValoresCarregados() 
					&& (linha.alterado 
							|| ($scope.isDefined($scope.origemDoValorAgrupado(linha)) 
									&& typeof linha.metaAnalitica !== 'undefined' 
									&& typeof linha.meta === 'undefined'))) {
				var fnNaoVazio = function(v) { return !isEmpty(v.meta) };
				if (linha.valores().contains(fnNaoVazio)) {
					soma = linha.valores().sum(function(v) { return v.metaCalculada() });
				} else if (linha.valoresFonteados().contains(fnNaoVazio) || $scope.isDefined($scope.origemDoValorAgrupado(linha))) {
					soma = linha.valoresFonteados().sum(function(v) { return v.metaCalculada() });
				}
				if (typeof soma === 'undefined') {
					soma = linha.valores().sum(function(v) { return v.metaCalculada() });
				}
			} else {
				if (typeof linha.metaAnalitica !== 'undefined') {
					soma = linha.metaAnalitica;
				} else if ($scope.isDefined($scope.origemDoValorAgrupado(linha))) {
					soma = $scope.valorSelecionado(linha);
				} else {
					soma = linha.valor;
				}
			}
		} else {
			soma = 0;
			for (var i = 0; i < filhos.length; i++) {
				soma += filhos[i].metaCalculada();
			}
		}
		return soma;
	}
	$scope.saldo = function (linha) {
		if (typeof linha === 'undefined') return undefined;
		return Math.round((linha.metaCalculada() - 
			$scope.somatorioDeMetasDosFilhos(linha)) * 100) / 100;
	}
	$scope.valorSelecionado = function (linha) {
		var filhos = valoresFilhosDe(linha);
		if (filhos.length > 0) {
			return filhos.sum(function(f) { return $scope.valorSelecionado(f) });
		}
		var origem = $scope.origemDoValorAgrupado(linha);
		if (typeof origem === 'undefined') return linha.valor;
		return $scope.origens[origem].valoresAgrupados[
			linha.grupoReceitaFonteada.grupoReceitaFonteada];
	}
	$scope.chaveiaEdicaoAgrupados = function () {
		escondeMensagemDeErro();
		$scope.editandoValoresAgrupados = !$scope.editandoValoresAgrupados;
	}
	$scope.chaveiaEdicaoNaoFonteados = function () {
		escondeMensagemDeErro();
		if ($scope.verificaValorAnalitico('nao-fonteado')) {
			$scope.editandoValoresNaoFonteados = !$scope.editandoValoresNaoFonteados;
		}
	}
	$scope.chaveiaEdicaoFonteados = function () {
		escondeMensagemDeErro();
		if ($scope.verificaValorAnalitico('fonteado')) {
			$scope.editandoValoresFonteados = !$scope.editandoValoresFonteados;
		}
	}
	$scope.quantidadeDeConfiguracoesEmMaisDeUmGrupoContidosEm = 
		function (valorAgrupado) {
		if (typeof $scope.configuracoesPertencentesAMaisDeUmGrupoFonteado === 
					'undefined' || 
				$scope.configuracoesPertencentesAMaisDeUmGrupoFonteado.length === 0) {
			return undefined;
		}
		var arr = [];
		$scope.configuracoesPertencentesAMaisDeUmGrupoFonteado.forEach(
			function (c) {
				c[1].forEach(function(codigo) {
					var regex = 
						new RegExp(valorAgrupado.grupoReceitaFonteada.grupoReceitaFonteada.
							replace(/0/g, '\\d'));
					if (codigo.match(regex) && arr.indexOf(c[0]) == -1) {
						arr.push(c[0]);
					}
				}
			);
		});
		return arr.length === 0 ? undefined : arr.length;
	}
	$scope.isFazParteDeMaisDeUmGrupoFonteado = function(valorAnalitico) {
		if (typeof $scope.configuracoesPertencentesAMaisDeUmGrupoFonteado === 
				'undefined') {
			return false;
		}
		return $scope.configuracoesPertencentesAMaisDeUmGrupoFonteado.
			contains(function (c) {
				return c[0] === valorAnalitico.id
			}
		);
	}
	$scope.verificaValorAnalitico = function (tipo) {
		var v1 = $scope.valorAgrupadoSelecionado().valores();
		var v2 = $scope.valorAgrupadoSelecionado().valoresFonteados();
		var resultado = true;
		var f = function (v1, v2, s) {
			v1.forEach(function (v) {
				if (!isEmpty(v.meta)) {
					siop.mostraMensagemDeErro('Existem valores finais ' + s + 
						'fonteados já informados. Apague-os antes de editar.');
					resultado = false;
					return;
				}
			});
		};
		if (tipo === 'fonteado') {
			f(v1, v2, 'não ');
		} else {
			f(v2, v1, '');
		}
		return resultado;
	}
	$scope.proporcionalizar = function (linha) {
		_proporcionalizar(linha, function(v) { 
			return v.selecionado && isEmpty(v.meta) 
		});
	}
	$scope.proporcionalizarGlobal = function (linha) {
		if (typeof linha === 'undefined') {
			visitarValoresAgregados(
				valoresAgrupadosSendoExibidosEeSelecionados(), 
				_proporcionalizarTodos, function() {} /*_proporcionalizarTodos*/);
		} else {
			_proporcionalizarTodos(linha);
		}
	}
	var _proporcionalizar = function (linha, f) {
		if (typeof linha === 'undefined') return;
		if (isEmpty(linha.meta)) return;
		var valoresSelecionados, saldo;
		var filhos = valoresFilhosDe(linha);
		if (filhos.length === 0) {
			if (linha.isValoresCarregados()) {
				linha.proporcionalizarSaldo = undefined;
				valoresSelecionados = linha.valores().select(f);
				if (valoresSelecionados.length === 0) {
					valoresSelecionados = linha.valoresFonteados().select(f);
					saldo = parseFloat(linha.meta) - 
						linha.valoresFonteados().sum(metaOuValor);
				} else {
					saldo = parseFloat(linha.meta) - linha.valores().sum(metaOuValor);
				}
			} else {
				linha.metaAnalitica = linha.metaCalculada();
				linha.proporcionalizarSaldo = true;
				return;
			}
		} else {
			valoresSelecionados = filhos.select(f);
			saldo = parseFloat(linha.meta) - filhos.sum(metaOuValor);
		}
		var somaDeValores = valoresSelecionados.sum(function(v) { return v.valor });
		var somaDeIncrementos = 0;
		if (somaDeValores !== 0) {
			valoresSelecionados.forEach(function(v) {
				var incremento = Math.round(saldo * (v.valor / somaDeValores) /* * 100 */) /* / 100 */;
				somaDeIncrementos += incremento;
				if (incremento !== 0) {
					if (typeof v.meta === 'undefined') v.meta = 0;
					v.meta = v.valor + incremento;
					linha.alterado = true;
				}
			});
			if (Math.round(saldo * 100) !== Math.round(somaDeIncrementos * 100) && valoresSelecionados.length > 0) {
				var residuo = saldo - somaDeIncrementos;
				var indiceASomarOResiduo = 0;
				if (residuo < 0) {
					for (var i = 0; i < valoresSelecionados.length; i++) {
						if (typeof valoresSelecionados[i].meta !== 'undefined' && valoresSelecionados[i].meta >= -residuo) {
							indiceASomarOResiduo = i;
							break;
						}
						if (typeof valoresSelecionados[i].meta === 'undefined' && valoresSelecionados[i].valor >= -residuo) {
							indiceASomarOResiduo = i;
							break;
						}
					}
				}
				if (typeof valoresSelecionados[indiceASomarOResiduo].meta === 'undefined') {
					valoresSelecionados[indiceASomarOResiduo].meta = valoresSelecionados[indiceASomarOResiduo].valor;
				}
				valoresSelecionados[indiceASomarOResiduo].meta += residuo;
			}
		}
	}
	var _proporcionalizarTodos = function(linha) {
		_proporcionalizar(linha, function(v) { return isEmpty(v.meta) && !$scope.isFazParteDeMaisDeUmGrupoFonteado(v) });
	}
	function valoresAnaliticosDaLinhaAgrupadaSelecionada (tipo) {
		var linha = $scope.valorAgrupadoSelecionado();
		if (typeof linha === 'undefined') return undefined;
		if (valoresFilhosDe(linha).length > 0) return undefined;
		return tipo === 'fonteado' ? linha.valoresFonteados() : linha.valores();
	}
	$scope.selecionarTodosSemMeta = function (tipo) {
		var linha = $scope.valorAgrupadoSelecionado();
		var filhos;
		if (typeof linha === 'undefined') {
			filhos = valoresAgrupadosSendoExibidos();
		} else {
			filhos = valoresFilhosDe(linha);
		}
		var selecionar = function(v) { 
			if ((isEmpty(v.meta) || typeof linha === 'undefined') 
					&& !$scope.isFazParteDeMaisDeUmGrupoFonteado(v)) {
				v.selecionado = true 
			}
		};
		if (filhos.length === 0) {
			var valores = valoresAnaliticosDaLinhaAgrupadaSelecionada(tipo);
			if (valores === undefined) return;
			valores.forEach(selecionar);			
		} else {
			filhos.forEach(selecionar);
		}
	}
	$scope.deselecionarTodos = function(tipo) {
		var linha = $scope.valorAgrupadoSelecionado();
		var filhos;
		if (typeof linha === 'undefined') {
			filhos = valoresAgrupadosSendoExibidos();
		} else {
			filhos = valoresFilhosDe(linha);
		}
		var deselecionar = function(v) { v.selecionado = false };
		if (filhos.length === 0) {
			var valores = valoresAnaliticosDaLinhaAgrupadaSelecionada(tipo);
			if (valores === undefined) return;
			valores.forEach(deselecionar);
		} else {
			filhos.forEach(deselecionar);
		}
	}
	$scope.atualizar = function() {
		carregaValoresAgrupados();		
	}
	$scope.valorTotal = function() {
		return somaTotal(function(v) { return v.valor });
	}
	$scope.metaCalculadaTotal = function() {
		return somaTotal(function(v) { return v.metaCalculada() });
	}
	$scope.valorTotalOrigem = function(origem) {
		return somaTotal(function(v) { 
			return $scope.origens[origem].valoresAgrupados[
				v.grupoReceitaFonteada.grupoReceitaFonteada]; 
		});
	}
	$scope.valorSelecionadoTotal = function() {
		return somaTotal(function(v) { return $scope.valorSelecionado(v) });
	}
	$scope.desfazer = function() {
		if ($scope.mostrandoGrupoDeReceita) {
			visitarValoresAgregados(valoresAgrupadosSendoExibidosEeSelecionados(), 
				function(l) { l.meta = undefined; l.alterado = true; }, 
				desfazerUltimoNivelAgregado);
		} else {
			desfazerUltimoNivelAgregado($scope.valorAgrupadoSelecionado());
		}
	}
	$scope.adicionarColuna = function() {
		jQuery('.popover').hide();
		jQuery('#mask').hide();
		var origem = jQuery('#form\\:botoes_adicionais\\:CenarioAjustesAdicionarColuna\\:origem').val();
		_adicionarColuna(origem);
	}
	function _adicionarColuna(origem, f) {
		OrigensDeDados.valores({ nome: escape(origem) }, function(valores) {
			if (valores.hasOwnProperty("mensagem")) {
				siop.mostraMensagemDeErro(valores.mensagem);
				return;
			}
			$scope.colunasAdicionadas.push(origem);
			$scope.origens[origem] = valores;
			if (typeof f !== 'undefined') f();
		})
	}
	$scope.excluirColunasSelecionadas = function() {
		for (var c in $scope.colunasAdicionaisSelecionadas) {
			$scope.colunasAdicionadas.splice(
				$scope.colunasAdicionadas.indexOf(c), 1);
		};
		$scope.colunasAdicionaisSelecionadas = {};
	}
	$scope.esconderColunas = function() {
		if ($scope.colunasAdicionadas.length > 0){
			//siop.mostraMensagemDeAlerta("Escondendo colunas...(adicionadas: " + $scope.colunasAdicionadas.length + ")");
			$scope.colunasEscondidas = $scope.colunasAdicionadas.slice(0);
			$scope.colunasAdicionadas = [];
			escondeMensagemDeAlerta();
		}
		else if ($scope.colunasEscondidas.length > 0){
			//siop.mostraMensagemDeAlerta("Mostrando colunas...(escondidas: " + $scope.colunasAdicionadas.length + ")");
			$scope.colunasAdicionadas = $scope.colunasEscondidas.slice(0);
			$scope.colunasEscondidas = [];
			escondeMensagemDeAlerta();
		}
	}

	$scope.selecionarOrigem = 
		function (origem, linha, naoAtualizarMetasAnaliticas, isCarregandoValores) {
			(function f (origem, linha) {
				if (isCarregandoValores === 'undefined') { isCarregandoValores = false; }
				if (typeof $scope.origensSelecionadas === 'undefined') {
					$scope.origensSelecionadas = [];
				}
				var filhos = valoresFilhosDe(linha);
				if (!$scope.origemSelecionada_(origem, linha)) {
					$scope.desmarcarOrigem(linha, true);
					$scope.origensSelecionadas.push(
						linha.grupoReceitaFonteada.grupoReceitaFonteada + "|" + origem);
					if (filhos.length === 0) {
						associarValoresDaOrigemAosValoresFonteados(linha, isCarregandoValores);
					}
					associarFuncoesAsInstanciasDosValoresAnaliticos(linha);
				}
				for (var i = 0; i < filhos.length; i++) {
					f(origem, filhos[i]);
				}
			}(origem, linha));
			/*
			if (typeof naoAtualizarMetasAnaliticas === 'undefined' || 
			!naoAtualizarMetasAnaliticas) {
				var par = linha.grupoReceitaFonteada.grupoReceitaFonteada + 
					'|' + origem;
				if (_origensRemovidas.indexOf(par) !== -1) {
					_origensRemovidas.remove(par);
				} else {
					if (_origensAdicionadas.indexOf(par) === -1) {
						_origensAdicionadas.push(par);
					}
				}
				atualizarMetasAnaliticas(linha);
			}
			*/
		};

	function associarValoresDaOrigemAosValoresFonteados (valorAgrupado, isCarregandoValores) {
		var origemSelecionada = $scope.origemDoValorAgrupado(valorAgrupado);
		if (!valorAgrupado.isValoresCarregados()) return;
		var vnf = valorAgrupado._valoresNaoFonteados;
		var vf = valorAgrupado._valoresFonteados;

		$scope.origens[origemSelecionada].valoresFonteados.forEach(function (v) {
			//(function encontraValorFonteadoCorrespondenteEeAssocia () {
				var i, vanf, found = false, v_;

				function adicionaValorNaoFonteadoAssociado () {
					var vanf = {
						id: 
							-vnf.length - 1 - indiceDoValorAgrupado(valorAgrupado) * 100000,
						naturezaReceita: v.naturezaReceita,
						subnaturezaReceita: "?",
						unidadeRecolhedora: "?",
						valor: v.valor,
						valorDaOrigem: true
					}
					vnf.push(vanf);
					return vanf;
				}

				for (i = 0; i < vf.length; i += 1) {
					if (vf[i].naturezaReceita === v.naturezaReceita 
							&& vf[i].orgao === v.orgao 
							&& vf[i].fonte === v.fonte 
							&& vf[i].esfera === v.esfera) {
						if (found) {
							if (!isCarregandoValores) {
								vf[i].meta = 0;
							}
						} else {
							v.valorAnaliticoFonteado = vf[i];
							vf[i].valorFonteadoDaOrigem = v;
							if (!isCarregandoValores) {
								delete vf[i].meta;
							}
						}
						if (vf[i].ajuste && vf[i].valorDaOrigem) {
							if (vf[i].valorDaOrigem) vf[i].valorOriginalDaOrigem = true;
							vf[i].valorDaOrigem = undefined;
							vanf = adicionaValorNaoFonteadoAssociado();
							vf[i].cenarioValorId = vanf.id;
						}							
						found = true;
					}
				}
			//}());
			if (!isEmpty(valorAgrupado.meta)) return;
			(function criaNovoValorFonteadoEeAssociaCasoNaoEncontre () {
				var vanf, vaf;
				if (isEmpty(v.valorAnaliticoFonteado) 
							&& valorAgrupado.grupoReceitaFonteada.grupoReceitaFonteada === 
										v.grupoReceitaFonteada) {
					vanf = adicionaValorNaoFonteadoAssociado(v);
					vaf = {
						id: 
							-vf.length - 1 - indiceDoValorAgrupado(valorAgrupado) * 100000, 
						cenarioValorId: vanf.id,
						naturezaReceita: v.naturezaReceita, 
						orgao: v.orgao,
						fonte: v.fonte,
						esfera: v.esfera,
						valor: v.valor,
						valorDaOrigem: true
					}
					v.valorAnaliticoFonteado = vaf;
					vaf.valorFonteadoDaOrigem = v;
					vf.push(vaf);
				}
			}());
		});
	};

	function atualizarMetasAnaliticas (linha) {
		var temValoresNaoCarregados = false;
		visitarValoresAgregados([linha], function() {}, function(l) { 
			if (!l.isValoresCarregados()) { temValoresNaoCarregados = true; }
		});
		if (temValoresNaoCarregados) {
			var origensAdicionadasComoTexto = '';
			var origensRemovidasComoTexto = '';
			_origensAdicionadas.forEach(function(o) {
				if (origensAdicionadasComoTexto.length > 0) {
					origensAdicionadasComoTexto += '|';
				}
				origensAdicionadasComoTexto += o;
			})
			_origensRemovidas.forEach(function(o) {
				if (origensRemovidasComoTexto.length > 0) {
					origensRemovidasComoTexto += '|';
				}
				origensRemovidasComoTexto += o;
			})
			Cenario.valoresPorGrupoReceitasFonteadas({ id: $scope.id, 
				exercicio: $scope.exercicioSelecionado, 
				sufixo: 'origensAdicionadas=' + 
					origensAdicionadasComoTexto + '&origensRemovidas=' + 
					origensRemovidasComoTexto }, 
	 			function(resultado) {
	 				if (resultado.hasOwnProperty("mensagem")) {
						siop.mostraMensagemDeErro(resultado.mensagem);
						return;
					}
					_valoresAgrupados.forEach(function(va_atual) {
						resultado.valores.forEach(function(va_novo) {
							if (va_atual.grupoReceitaFonteada.grupoReceitaFonteada === va_novo.grupoReceitaFonteada.grupoReceitaFonteada) {
								va_atual.metaAnalitica = va_novo.metaAnalitica;
							}
						});
					});
	 			}
	 		);
		}
	}

	$scope.desmarcarOrigem = function (linha, naoAtualizarMetasAnaliticas) {
		var origem = $scope.origemDoValorAgrupado(linha);
		if (typeof origem === 'undefined') return;
		function f (linha) {
			var origem = $scope.origemDoValorAgrupado(linha);
			if (typeof origem !== 'undefined') {
				var i = $scope.origensSelecionadas.indexOf(
					linha.grupoReceitaFonteada.grupoReceitaFonteada + "|" + origem);
				removerValoresAnaliticosExcedentesDaOrigem(linha);
				linha.alterado = true;
				$scope.origensSelecionadas.splice(i, 1);
			}
			var filhos = valoresFilhosDe(linha);
			for (var i = 0; i < filhos.length; i++) {
				f(filhos[i]);
			}
		}
		f(linha);
		/*
		if (typeof naoAtualizarMetasAnaliticas === 'undefined' || !naoAtualizarMetasAnaliticas) {
			var par = linha.grupoReceitaFonteada.grupoReceitaFonteada + '|' + origem;
			if (_origensAdicionadas.indexOf(par) !== -1) {
				_origensAdicionadas.remove(par);
			} else {
				if (_origensRemovidas.indexOf(par) === -1) _origensRemovidas.push(par);
			}
			atualizarMetasAnaliticas(linha);
		}
		*/
	}
	function removerValoresAnaliticosExcedentesDaOrigem (linha) {
		if (typeof linha === 'undefined') return;
		var filhos = valoresFilhosDe(linha);
		if (filhos.length === 0) {
			if (linha.isValoresCarregados()) {
				linha.valores().removeAll(function (v) { return v.valorDaOrigem });
				linha.valoresFonteados().removeAll(
					function (v) { 
						return v.valorDaOrigem || v.valorOriginalDaOrigem;
					}
				);
				var origemSelecionada = $scope.origemDoValorAgrupado(linha);
				$scope.origens[origemSelecionada].valoresFonteados.forEach(
					function (v) {
						if (typeof v.valorAnaliticoFonteado !== 'undefined' &&
								linha.grupoReceitaFonteada.grupoReceitaFonteada === 
									v.grupoReceitaFonteada) {
							v.valorAnaliticoFonteado.valorFonteadoDaOrigem = undefined;
							v.valorAnaliticoFonteado = undefined;
						}
					}
				);
			}
		} else {
			filhos.forEach(function (f) {
				removerValoresAnaliticosExcedentesDaOrigem(f);
			});
		}
	}
	$scope.origemSelecionada_ = function(origem, linha) {
		if ($scope.temOrigemPropriaSelecionada(origem, linha)) return true;
		var filhos = valoresFilhosDe(linha);
		for (var i = 0; i < filhos.length; i++) {
			if ($scope.origemSelecionada_(origem, filhos[i])) return true;
		}
		return false;
	}
	$scope.temOrigemPropriaSelecionada = function(origem, linha) {
		if (typeof $scope.origensSelecionadas === 'undefined') return false;
		return $scope.origensSelecionadas.indexOf(linha.grupoReceitaFonteada.grupoReceitaFonteada + "|" + origem) !== -1;
	}
	function _tfs(origem, linha) {
		if ($scope.temOrigemPropriaSelecionada(origem, linha)) return true;
		var filhos = valoresFilhosDe(linha);
		for (var i = 0; i < filhos.length; i++) {
			if (_tfs(origem, filhos[i])) return true;
		}
		return false;
	}
	$scope.temFilhoSelecionado = function(origem, linha) {
		if ($scope.temOrigemPropriaSelecionada(origem, linha)) return false;
		return _tfs(origem, linha);
	}
	$scope.prefixoColunaAdicionalSelecionada = function(c) {
		if ($scope.colunasAdicionaisSelecionadas[c]) return '*';
		return '';
	}
	$scope.valorFonteadoDaOrigem = function(origem, linha) {
		if (typeof $scope.origens[origem] === 'undefined') return undefined;
		var vv = $scope.origens[origem].valoresFonteados;
		if (typeof vv === 'undefined') return undefined;
		if (typeof linha.valorFonteadoDaOrigem === 'undefined') return undefined;
		return linha.valorFonteadoDaOrigem.valor;
		/*
		for (var i = 0; i < vv.length; i++) {
			if (!isEmpty(vv[i].valorAnaliticoFonteado) && vv[i].valorAnaliticoFonteado.id === linha.id) {
				return vv[i].valor;
			}
		};
		return undefined;
		*/
	}
	$scope.isValorAgrupadoSelecionadoTemOrigemSelecionada = function() {
		return $scope.isDefined($scope.origemDoValorAgrupado($scope.valorAgrupadoSelecionado()));
	}
	$scope.adicionarAjusteFonteado = function() {
		if (!$scope.verificaValorAnalitico('fonteado')) return;
		if (isEmpty($scope.novoAjusteFonteadoNaturezaReceita)) {
			siop.mostraMensagemDeErro("A Natureza de Receita deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteFonteadoOrgao)) {
			siop.mostraMensagemDeErro("A UO deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteFonteadoFonte)) {
			siop.mostraMensagemDeErro("A Fonte deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteFonteadoEsfera)) {
			siop.mostraMensagemDeErro("A Esfera deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteFonteadoValor)) {
			siop.mostraMensagemDeErro("O valor deve ser informado");
			return;
		}
		var codigoDoGrupoFonteado = $scope.valorAgrupadoSelecionado().grupoReceitaFonteada.grupoReceitaFonteada;
		var ajuste = { id: -$scope.valorAgrupadoSelecionado().valoresFonteados().length, naturezaReceita: $scope.novoAjusteFonteadoNaturezaReceita, orgao: $scope.novoAjusteFonteadoOrgao, fonte: $scope.novoAjusteFonteadoFonte, esfera: $scope.novoAjusteFonteadoEsfera, valor: 0, meta: parseFloat($scope.novoAjusteFonteadoValor), ajuste: true };
		$scope.mensagemDeAlerta = "Verificando...";
		CenarioGrupoFonteado.verificarAjusteFonteado({ id: $scope.id, exercicio: $scope.exercicioSelecionado, grupoReceitaFonteada: codigoDoGrupoFonteado }, ajuste, function(resultado) {
				if (resultado.hasOwnProperty("mensagem")) {
					siop.mostraMensagemDeErro(resultado.mensagem);
					return;
				}
				associarFuncoesAsInstanciasDosValoresAnaliticos({ _valoresFonteados: [ ajuste ] });
				ajuste.metaOriginal = undefined;
				$scope.valorAgrupadoSelecionado()._valoresFonteados.push(ajuste);
				$scope.novoAjusteFonteadoNaturezaReceita = undefined;
				$scope.novoAjusteFonteadoOrgao = undefined;
				$scope.novoAjusteFonteadoFonte = undefined;
				$scope.novoAjusteFonteadoEsfera = undefined;
				$scope.novoAjusteFonteadoValor = undefined;
				$scope.novoAjusteFonteadoExibido = false;
		});
	}
	$scope.adicionarAjusteNaoFonteado = function() {
		if (!$scope.verificaValorAnalitico('nao-fonteado')) return;
		if (isEmpty($scope.novoAjusteNaoFonteadoNaturezaReceita)) {
			siop.mostraMensagemDeErro("A Natureza de Receita deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteNaoFonteadoUnidadeRecolhedora)) {
			siop.mostraMensagemDeErro("A Unidade Receita deve ser informada");
			return;
		}
		if (isEmpty($scope.novoAjusteNaoFonteadoValor)) {
			siop.mostraMensagemDeErro("O valor deve ser informado");
			return;
		}
		var codigoDoGrupoFonteado = $scope.valorAgrupadoSelecionado().grupoReceitaFonteada.grupoReceitaFonteada;
		var ajuste = { id: -$scope.valorAgrupadoSelecionado().valores().length, naturezaReceita: $scope.novoAjusteNaoFonteadoNaturezaReceita, subnatureza: $scope.novoAjusteNaoFonteadoSubnatureza, unidadeRecolhedora: $scope.novoAjusteNaoFonteadoUnidadeRecolhedora, valor: 0, meta: parseFloat($scope.novoAjusteNaoFonteadoValor), ajuste: true };
		$scope.mensagemDeAlerta = "Verificando...";
		CenarioGrupoFonteado.verificarAjusteNaoFonteado({ id: $scope.id, exercicio: $scope.exercicioSelecionado, grupoReceitaFonteada: codigoDoGrupoFonteado }, ajuste, function(resultado) {
				if (resultado.hasOwnProperty("mensagem")) {
					siop.mostraMensagemDeErro(resultado.mensagem);
					return;
				}
				associarFuncoesAsInstanciasDosValoresAnaliticos({ _valoresNaoFonteados: [ ajuste ] });
				ajuste.metaOriginal = undefined;
				$scope.valorAgrupadoSelecionado()._valoresNaoFonteados.push(ajuste);
				$scope.novoAjusteNaoFonteadoNaturezaReceita = undefined;
				$scope.novoAjusteNaoFonteadoSubnatureza = undefined;
				$scope.novoAjusteNaoFonteadoUnidadeRecolhedora = undefined;
				$scope.novoAjusteNaoFonteadoValor = undefined;
				$scope.novoAjusteNaoFonteadoExibido = false;
		});
	}
	$scope.valorFonteadoTotal = function(linha) {
		if (typeof $scope.naturezaSelecionada === 'undefined')
			return linha.valoresFonteados().sum(function(v) { return v.valor });
		else
			return linha.valoresFonteados().select(function(v) { return v.naturezaReceita === $scope.naturezaSelecionada }).sum(function(v) { return v.valor });
	}
	$scope.metaAlterada = function(linha) {
		linha.alterado = true;
	}
	$scope.somaDosValoresAnaliticosFiltrados = function(vv, fonteado) {
		if (typeof vv === 'undefined') return undefined;
		var valoresFiltrados = vv.select(function(v) { 
			return $scope.filtraPorNatureza(v) 
					&& (!fonteado && $scope.filtraPorFiltrosNaoFonteados(v)
							|| fonteado && $scope.filtraPorFiltrosFonteados(v));
		});
		return valoresFiltrados.sum(function(v) { return v.valor });
	}
	$scope.noop = function () {
	}
	$scope.cenarioN = function () {
		CenarioN.get({id: $scope.id}, function (resultado) {
			console.log(resultado.titulo);
			console.log(resultado.gradeParametro.descricao);
		});
	}
	var visitarValoresAgregados = function(linhas, fagregado, fanalitico) {
		if (typeof linhas === 'undefined') return;
		linhas.forEach(function(l) {
			fagregado(l);
			var filhos = valoresFilhosDe(l);
			if (filhos.length === 0) {
				fanalitico(l);
			} else {
				visitarValoresAgregados(filhos, fagregado, fanalitico);
			}
		});
	}
	var desfazerUltimoNivelAgregado = function(l) {
		if (l.isValoresCarregados()) {
			l.valores().forEach(function(v) { v.meta = undefined });
			l.valoresFonteados().forEach(function(v) { v.meta = undefined });
		} else {
			l.desfazerAjustes = true;
			l.metaAnalitica = undefined;
		}
	}
	var somaTotal = function(f) {
		if (typeof _valoresAgrupados === 'undefined') return undefined;
		if (typeof $scope.valorAgrupadoSelecionado() !== 'undefined') {
			return f($scope.valorAgrupadoSelecionado());
		}
		var soma = 0;
		var regex = new RegExp(/^\d00/);
		_valoresAgrupados.forEach(function(v) {
			if (v.grupoReceitaFonteada.grupoReceitaFonteada.match(regex)) {
				soma += f(v);
			}
		});
		return soma;
	}
	$scope.if = function(p, t, f) {
		return p ? t : f;
	}
	$scope.isDefined = function(x) {
		return typeof x !== 'undefined';
	}
	$scope.isEmpty = isEmpty;
	var valoresFilhosDe = function(valor) {
		var resultado = [];
		if (typeof valor === 'undefined' 
				|| typeof valor.grupoReceitaFonteada === 'undefined' 
				|| typeof _valoresAgrupados === 'undefined') {
			return resultado;
		}
		var codigoSelecionado = valor.grupoReceitaFonteada.grupoReceitaFonteada;
		let zerosDireita = 0;
		if(codigoSelecionado.includes('0') && codigoSelecionado.endsWith('0')) {
			 zerosDireita = codigoSelecionado.length - codigoSelecionado.indexOf(0);
		}
		if(zerosDireita < 0) {
			zerosDireita = 0;
		}
		let tamanhoFaixa = Number('1'.concat('0'.repeat(zerosDireita)));
		let finalFaixa = Number(codigoSelecionado) + Number(tamanhoFaixa);

		if (typeof cacheDeValoresFilhos[codigoSelecionado] !== 'undefined') {
			return cacheDeValoresFilhos[codigoSelecionado];
		}

		console.log(codigoSelecionado + ' - ' + finalFaixa);
		var regex = new RegExp(codigoSelecionado.replace(/0/, '\\d'));
		_valoresAgrupados.forEach(function(v) {
			let codigoDoFilho = v.grupoReceitaFonteada.grupoReceitaFonteada;
			// && codigoDoFilho.match(regex)
			// && Number(codigoDoFilho) > Number(codigoSelecionado)
			// && Number(codigoDoFilho) < finalFaixa
			if (codigoDoFilho !== codigoSelecionado 
				&& Number(codigoDoFilho).between(Number(codigoSelecionado), Number(finalFaixa))) {
				if(zerosDireita !== 2 && !codigoDoFilho.endsWith('0'.repeat(zerosDireita - 1))) {
					return;
				}
				if(zerosDireita === 2) {
					if(!codigoDoFilho.endsWith('0') && codigoDoFilho.charAt(6) !== '0') {
						return;
					}
				}
				console.log('passou : ' + codigoDoFilho);
				resultado.push(v);
			}
		});
		cacheDeValoresFilhos[codigoSelecionado] = resultado;
		return resultado;
	}
	var valoresAgrupadosSendoExibidos = function() {
		return $scope.$eval("valoresAgrupados() | filter:filtroDeValores");
	}
	var valoresAgrupadosSendoExibidosEeSelecionados = function() {
		return valoresAgrupadosSendoExibidos().select(function(l) { return l.selecionado });
	}
	var indiceDoValorAgrupado = function (va) {
		var i;
		if (typeof _valoresAgrupados === 'undefined') { return -1; }
		for (var i = 0; i < _valoresAgrupados.length; i += 1) {
			if (_valoresAgrupados[i].grupoReceitaFonteada.grupoReceitaFonteada ===
						va.grupoReceitaFonteada.grupoReceitaFonteada) {
				return i;
			}
		}
		return -1;
	}
}

function PaginatorCtrl($scope, $element, Contexto) {
	var tableElement = $element.prev();
	var ngRepeat = tableElement.data('ng-repeat');
	var table_id = tableElement.data('table_id');
	$scope.tableScope = angular.element(tableElement).scope();
	if (typeof $scope.tableScope.paginator_info === 'undefined') $scope.tableScope.paginator_info = {};
	$scope.tableScope.paginator_info[table_id] = $scope;
	$scope.paginaAtual = 1;
	$scope.itensPorPagina = 10;
	$scope.contexto = Contexto;
	$scope.itens = function () {
		return $scope.tableScope.$eval(/.+ in (.+)/.exec(ngRepeat)[1]);
	}
	$scope.quantidadeDePaginas = function() {
		if (typeof $scope.itens() === 'undefined') return 0;
		var resultado = Math.ceil($scope.itens().length / $scope.itensPorPagina);
		if ($scope.paginaAtual > resultado && resultado > 0) $scope.paginaAtual = resultado;
		return resultado;
	};
	$scope.paginas = function() {
		var paginas = [];
		var inicio = $scope.paginaAtual - 3;
		if (inicio < 0) inicio = 0;
		if ($scope.quantidadeDePaginas() > 5 && inicio > $scope.quantidadeDePaginas() - 5) {
			inicio = $scope.quantidadeDePaginas() - 5;
		}
		for (var i = inicio; i < $scope.quantidadeDePaginas() && paginas.length < 5; i++) {
			paginas.push(i + 1);
		};
		return paginas;
	};
	$scope.irParaPagina = function(pagina) {
		$scope.paginaAtual = pagina;
	}
	$scope.irParaPrimeiraPagina = function(pagina) {
		$scope.irParaPagina(1);
	}
	$scope.irParaUltimaPagina = function(pagina) {
		$scope.irParaPagina($scope.quantidadeDePaginas());
	}
	$scope.proximaPagina = function(pagina) {
		if ($scope.paginaAtual < $scope.quantidadeDePaginas()) $scope.irParaPagina($scope.paginaAtual + 1);
	}
	$scope.paginaAnterior = function(pagina) {
		if ($scope.paginaAtual > 1) $scope.irParaPagina($scope.paginaAtual - 1);
	}
}