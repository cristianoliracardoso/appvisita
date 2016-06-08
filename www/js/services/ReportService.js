var app = angular.module('codhab.services.ReportService', []);

app.service("ReportService", function ($q, AuthService, $cordovaGeolocation, $ionicPopup) {
	var self = {
		'page': 0,
		'page_size': '20',
		'isLoading': false,
		'isSaving': false,
		'hasMore': true,
		'results': [],
		'refresh': function () {
			self.page = 0;
			self.isLoading = false;
			self.isSaving = false;
			self.hasMore = true;
			self.results = [];
			return self.load();
		},
		'next': function () {
			self.page += 1;
			return self.load();
		},
		'load': function () {
			self.isLoading = true;
			var d = $q.defer();
			// Query
			var Report = Parse.Object.extend("Report");
			var reportQuery = new Parse.Query(Report);
			reportQuery.descending('created');
			reportQuery.equalTo("owner", AuthService.user);

			// Realizar Query

			reportQuery.find({
				success: function (results){
					angular.forEach(results, function(item){
						var report = new Report(item);
						self.results.push(report)
					});
					console.debug(self.results);

					//fim da lista
					if (results.length == 0){
						self.hasMore = false;
					}

					// Fim woohoo!!!!
					d.resolve();
				}
			});

			return d.promise;
		},
		'track': function (data) {
			self.isSaving = true;
			var d = $q.defer();
			// Transformar lat e o lon em float senão fode tudo. Não funciona no emulador, não sei pq pergunta pra Deus.
			lat = parseFloat(data.lat);
			lon = parseFloat(data.lon);
		  var point = new Parse.GeoPoint({latitude: lat, longitude: lon});
			var Report = Parse.Object.extend("Report");
			var user = AuthService.user;
			var file = data.picture ? new Parse.File("photo.jpg", {base64: data.picture}) : null;
			var report = new Report();
			report.set("local",data.local);
			report.set("selo", data.selo);
			report.set("nometitular", data.nometitular);
			report.set("nascimento", data.nascimento);
			report.set("naturalidade", data.naturalidade);
			report.set("sexo", data.sexo);
			report.set("CPF", data.CPF);
			report.set("rg", data.rg);
			report.set("emissor", data.emissor);
			report.set("emissao", data.emissao);
			report.set("estadocivil", data.estadocivil);
			report.set("nome_conjuge", data.nome_conjuge);
			report.set("CPF_conjuge", data.CPF_conjuge);
			report.set("endres", data.endres);
			report.set("telefone", data.telefone);
		//	report.set("assembleias", data.assembleias);
			report.set("recebe_aposentadoria", data.recebe_aposentadoria);
			report.set("recebe_beneficio", data.recebe_beneficio);
			report.set("recebe_pensao", data.recebe_pensao);
			report.set("pessoas_residencia", data.pessoas_residencia);
			report.set("numero_nis", data.numero_nis);
			report.set("renda_familiar", data.renda_familiar);
			if (lat != ''){
				report.set("localizacao",point);
			}
			report.save(null,{
					success: function(){
						console.log("Report Feito");
						self.results.unshift(report);
						$ionicPopup.alert({
							title: "Report feito com sucesso",
							subTitle: "você será redirecionado"
						})
						d.resolve(report);
					},
					error: function(item,error){
						$ionicPopup.alert({
							title: "Erro ao reportar obra",
							subTitle: error.message
						})
						d.reject(error);
					}
			});
			return d.promise;
		}
	};
	return self;
});
