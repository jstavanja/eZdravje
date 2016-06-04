
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

function generirajTriUporabnike() {
    
    $("#kreiraniNoviZapis").html('<p class="lead">Generirani so bili trije novi zapisi:</p>');
    
    for(var i = 1; i <= 3; i++) {
        generirajPodatke(i);
    }
}

/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
    
    var ime = vrniIme(stPacienta);
    var priimek = vrniPriimek(stPacienta);
    var visina = vrniVisino(stPacienta);
    var teza = vrniTezo(stPacienta);
    
    var sessionId = getSessionId();
    var ehrId = "";
    
    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });
    
    var idDropdown = vrniIdDropdown(stPacienta);
    
    $.ajax({
        
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        
		        ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}, {key: "visina", value: visina}, {key: "teza", value: teza}]
		        };
		        
		        // console.log(partyData);
		        
		        $.ajax({
		            
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreiraniNoviZapis").append("<span class='obvestilo " +
                            "label label-success fade-in'>Uspešno generiran EHR '" +
                            ehrId + "'.</span><br>");
                            
		                }
		            },
		            error: function(err) {
		            	$("#kreiraniNoviZapis").append("<span class='obvestilo label " +
                        "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		        
		        // dodajanje value atributa v dropdown menu
		        
		        var dropdownElement;

                switch (stPacienta) {
                    case 1:
                        dropdownElement = $('#prviIdDropdown');
                        break;
                    case 2:
                        dropdownElement = $('#drugiIdDropdown');
                        break;
                    case 3:
                        dropdownElement = $('#tretjiIdDropdown');
                        break;
                    default:
                        alert("dropdown element setting error");
                        break;
                }
                // console.log(ehrId);
                dropdownElement.attr("value", ehrId);
                
		    }
	});

    return ehrId;
}

function vrniIdDropdown(stPacienta) {
    switch (stPacienta) {
        case 1:
            return "prviIdDropdown";
        case 2:
            return "drugiIdDropdown";
        case 3:
            return "tretjiIdDropdown";
        default:
            return "error id dropdown";
    }
}

function vrniIme(stPacienta) {
    switch (stPacienta) {
        case 1:
            return "Beti";
        case 2:
            return "Zofka";
        case 3:
            return "Cristiano";
        default:
            return "Napaka v stPacienta";
    }
}

function vrniPriimek(stPacienta) {
    switch (stPacienta) {
        case 1:
            return "Alfa";
        case 2:
            return "Sveder";
        case 3:
            return "Realdo";
        default:
            return "Napaka v stPacienta";
    }
}

function vrniTezo(stPacienta) {
    switch (stPacienta) {
        case 1:
            return 56;
        case 2:
            return 105;
        case 3:
            return 38;
        default:
            return "Napaka v stPacienta";
    }
}

function vrniVisino(stPacienta) {
    switch (stPacienta) {
        case 1:
            return 169;
        case 2:
            return 159;
        case 3:
            return 184;
        default:
            return "Napaka v stPacienta";
    }
}

// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija

function kreirajEHRzaBolnika() {
    
    var ime = $('#kreirajIme').val();
    var priimek = $('#kreirajPriimek').val();
    var visina = $('#dodajVitalnoTelesnaVisina').val();
    var teza = $('#dodajVitalnoTelesnaTeza').val();
    
    // console.log("Ime:" + ime + ", Priimek:" + priimek + ", visina: " + visina + ", teza: " + teza);
    
    var sessionId = getSessionId();
    var ehrId = "";
    
    $.ajaxSetup({
        headers: {"Ehr-Session": sessionId}
    });
    
    $.ajax({
        
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        
		        ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}, {key: "visina", value: visina}, {key: "teza", value: teza}]
		        };
		        
		        $.ajax({
		            
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreiraniNoviZapis").html("<span class='obvestilo " +
                            "label label-success fade-in'>Uspešno generiran EHR '" +
                            ehrId + "'.</span><br>");
                            
		                }
		            },
		            error: function(err) {
		            	$("#kreiraniNoviZapis").append("<span class='obvestilo label " +
                        "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
	});
	
	return ehrId;
}

function zacniPoizvedboZaRezultate() {
    
    var ehrId, ime, priimek, visina, teza;
    var sessionId = getSessionId();
    
    // 
    
    if ($('#ehrDropdown').val() == "----") {
        ehrId = $('#ehrIdZaIzracun').val();
        
        $.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				// console.log(JSON.stringify(party));
				ime = party.firstNames;
				priimek = party.lastNames;

				for (var i = 0; i < 3; i++) {
				    if (party.partyAdditionalInfo[i].key == "teza") {
				        console.log("teza is set");
				        teza = party.partyAdditionalInfo[i].value;
				    }
				}
				
				for (var i = 0; i < 3; i++) {
				    if (party.partyAdditionalInfo[i].key == "visina") {
				        console.log("visina is set");
				        visina = party.partyAdditionalInfo[i].value;
				    }
				}
				
				var bmiOsebe = izracunajBMI(visina, teza);
    
                $('#prikazRezultatov').html("Podatki o osebi: " + ime + " " + priimek + " " + visina + "cm " + teza + "kg. BMI:" + bmiOsebe);
                
                ime = "", visina = "", teza = "", priimek = "";
				
				
			},
			error: function(err) {
				$("#kreiraniNoviZapis").html("<span class='obvestilo label " +
                "label-danger fade-in'>Napaka '" +
                JSON.parse(err.responseText).userMessage + "'!");
			}
		});
		
    } else {
        
        ehrId = $('#ehrDropdown option:selected').attr("value");
        
         $.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			
	    	success: function (data) {
				var party = data.party;
				// console.log(party);
				ime = party.firstNames;
				priimek = party.lastNames;
				
				for (var i = 0; i < 3; i++) {
				    if (party.partyAdditionalInfo[i].key == "teza") {
				        // console.log("teza is set");
				        teza = party.partyAdditionalInfo[i].value;
				    }
				}
				
				for (var i = 0; i < 3; i++) {
				    if (party.partyAdditionalInfo[i].key == "visina") {
				        // console.log("visina is set");
				        visina = party.partyAdditionalInfo[i].value;
				    }
				}
				
				var bmiOsebe = izracunajBMI(visina, teza);
				
				graficniIzpis(ime, priimek, visina, teza, bmiOsebe);
				
			},
			error: function(err) {
				$("#kreiraniNoviZapis").html("<span class='obvestilo label " +
                "label-danger fade-in'>Napaka '" +
                JSON.parse(err.responseText).userMessage + "'!");
			}
		});
    }
    
}

function graficniIzpis(ime, priimek, visina, teza, bmi) {
        
    $('#prikazRezultatov').html("Osnovni podatki o osebi s tem EHRID: " + ime + " " + priimek + " " + visina + "cm " + teza + "kg." + "<br>");
    $('#prikazRezultatov').append("<h4>BMI:</h4>");
    $('#prikazRezultatov').append('                <svg id="fillgauge1" width="97%" height="250"></svg>\
                <script language="JavaScript">\
                    var gauge1 = loadLiquidFillGauge("fillgauge1", ' + bmi + ');\
                    var config1 = liquidFillGaugeDefaultSettings();\
                    config1.circleColor = "#FF7777";\
                    config1.textColor = "#FF4444";\
                    config1.waveTextColor = "#FFAAAA";\
                    config1.waveColor = "#FFDDDD";\
                    config1.circleThickness = 0.2;\
                    config1.textVertPosition = 0.2;\
                    config1.waveAnimateTime = 1000;\
                </script>')
    $('#prikazRezultatov').append(osmisliBMI(bmi));
}

function osmisliBMI(bmi) {
    if (bmi < 18.5) {
        return "Za svoje dimenzije ste prešibki.";
    }
    if (bmi > 18.5 && bmi <= 24.9) {
        return "Glede na BMI imate pravilno razmerje med težo in višino.";
    }
    if (bmi > 24.9 && bmi <= 29.9) {
        return "Rezultati izračuna BMI kažejo, da ste malce pretežki.";
    }
    else {
        return "Vaš BMI pravi, da ste hudo debeli.";
    }
}

function izracunajBMI(visina, teza) {
    var bmi = (teza) / ((visina/100) * (visina/100));
    // console.log("Izracunan BMI je: " + bmi);
    return bmi;
}