requirejs.config({
	baseUrl: '_js/',
  //urlArgs: "v=" +  (new Date()).getTime(),
  paths: {
    text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
    diff_match_patch: 'lib/diff_match_patch',
    sprintf: 'lib/sprintf',
    jQuery: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.10.1/jquery.min',
    mousetrap: '//cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.min',
    async: 'lib/async'
  }
});

var ENV;

if (window.location.host != 'www.siop.gov.br' &&
    window.location.host != 'www.siop.planejamento.gov.br') {
  ENV = 'production';
} else {
  ENV = 'development';
}

/**
 * JSON Parsing Problem Workaround
 * http://stackoverflow.com/questions/710586/json-stringify-bizarreness
 */
var _json_stringify = JSON.stringify;
JSON.stringify = function(value) {
  var r;
  if (Array.prototype.toJSON !== undefined) {
    var _array_tojson = Array.prototype.toJSON;
    delete Array.prototype.toJSON;
    r=_json_stringify(value);
    Array.prototype.toJSON = _array_tojson;
  } else {
    r=_json_stringify(value);
  }

  return r;
};