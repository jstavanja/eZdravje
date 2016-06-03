
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
		    }
	});

  return ehrId;
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
            return 78;
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
