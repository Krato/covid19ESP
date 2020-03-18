import _ from 'lodash';

var regions = {
    "Andalucía": {
        "code": "Andalucía",
        "long": -4.5,
        "lat": 37.6,
        "provincias": [
            "Almería",
            "Cádiz",
            "Córdoba",
            "Granada",
            "Huelva",
            "Jaén",
            "Málaga",
            "Sevilla",
        ],
    },

    "Aragon": {
        "code": "Aragon",
        "long": -1.0,
        "lat": 41.0,
        "provincias": [
            "Huesca",
            "Teruel",
            "Zaragoza"
        ]
    },
    "Baleares":{
        "code": "Baleares",
        "long": 2.864862,
        "lat": 39.611904,
        "provincias": [
            "Balears"
        ]
    },
    "Canarias":{
        "code": "Canarias",
        "long": 0.053592,
        "lat": 33.694495,
        "provincias": [
            "Santa Cruz de Tenerife",
            "Las Palmas"
        ]
    },
    "Cantabria":{
        "code": "Cantabria",
        "long": -5.86112,
        "lat": 43.36662,
        "provincias": [
            "Cantabria"
        ]
    },
    "Castilla La Mancha":{
        "code": "Castilla La Mancha",
        "long": -3.000033,
        "lat": 39.500011,
        "provincias": [
            "Albacete",
            "Ciudad Real",
            "Cuenca",
            "Guadalajara",
            "Toledo",
        ]
    },

    "Castilla y León":{
        "code": "Castilla y León",
        "long": -4.45,
        "lat": 41.383333,
        "provincias": [
            "Ávila",
            "Burgos",
            "León",
            "Palencia",
            "Salamanca",
            "Segovia",
            "Soria",
            "Valladolid",
            "Zamora",
        ]
    },

    "Cataluña":{
        "code": "Cataluña",
        "long": 1.86768,
        "lat": 41.82046,
        "provincias": [
            "Barcelona",
            "Girona",
            "Lleida",
            "Tarragona",
        ]
    },

    "Ceuta":{
        "code": "Ceuta",
        "long": -8.204515,
        "lat": 33.767589,
        "provincias": [
            "Ceuta"
        ]
    },
    
    "C. Valenciana":{
        "code": "C. Valenciana",
        "long": -0.37739,
        "lat": 39.45975,
        "provincias": [
            "Alicante",
            "Castellón",
            "Valencia",
        ]
    },
    
    "Extremadura":{
        "code": "Extremadura",
        "long": -6.16667,
        "lat": 39.16667,
        "provincias": [
            "Caceres",
            "Badajoz",
        ]
    },
    
    "Galícia":{
        "code": "Galícia",
        "long": -7.86621,
        "lat": 42.75508,
        "provincias": [
            "A Coruña",
            "Lugo",
            "Ourense",
            "Pontevedra",
        ]
    },
    
    "Madrid":{
        "code": "Madrid",
        "long": -3.70256,
        "lat": 40.4165,
        "provincias": [
            "Madrid",
        ]
    },
    
    "Melilla":{
        "code": "Melilla",
        "long": -6.711028,
        "lat": 32.975584,
        "provincias": [
            "Melilla",
        ]
    },
    
    "Murcia":{
        "code": "Murcia",
        "long": -1.13004,
        "lat": 37.98704,
        "provincias": [
            "Murcia",
        ]
    },

    "Navarra":{
        "code": "Navarra",
        "long": -1.676069,
        "lat": 42.695391,
        "provincias": [
            "Navarra",
        ]
    },

    "País Vasco":{
        "code": "País Vasco",
        "long": -2.75,
        "lat": 43.0,
        "provincias": [
            "Álava",
            "Guipúzcoa",
            "Vizcaya",
        ]
    },
    
    "La Rioja":{
        "code": "La Rioja",
        "long": -2.44373,
        "lat": 42.4650,
        "provincias": [
            "La Rioja",
        ]
    },
}

export default function getComunity(name) {
    return _.find(regions, (comunity) => {
        return comunity.provincias.indexOf(name) > -1
    });
}