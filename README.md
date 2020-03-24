<p align="center"><img src="https://user-images.githubusercontent.com/74367/76736685-365f7100-675f-11ea-9358-566e2752075b.png" width="396" height="160"></p>

# Covid19 en Español

Proyecto en español para la realización de un Panel de Control para la visualización de los datos del CoronaVirus Covid19.

Se ha usado "Español y no Castellano" siguiendo la recomendación de la [RAE](https://es.wikipedia.org/wiki/Controversia_por_el_nombre_del_idioma_espa%C3%B1ol#cite_ref-12)

<img width="1677" alt="Covid19 en España" src="https://user-images.githubusercontent.com/74367/77338547-cfc3ef80-6d2a-11ea-857b-0db9851f6b64.png">

### Partners

* [JSONBIN.io](https://jsonbin.io) - Muchas gracias a JSONBIN.io. Es un servicio online gratuito para almacenar archivos json.

### APIs utilizadas para la obtención de datos

Datos extraidos de diferentes fuentes:

* [Datadista](https://github.com/datadista/datasets/tree/master/COVID%2019) - Datos de España

* [Covid-19-Spain-API](https://github.com/michydev/Covid-19-Spain-API) - Api para consultar los últimos registros de España

* [NovelCov API](https://github.com/NovelCOVID/API) - Api que extrae los datos de worldometers 

* [coronavirus-tracker (API)](https://coronavirus-tracker-api.herokuapp.com) - Api que extrae los datos del CSSEGISandData

* [COVID-19 API](https://github.com/mathdroid/covid-19-api) - Api que extrae los datos del Instituto John Hopkins University CSSE

### Cómo contribuir con el proyecto

El proyecto está desarollado con vue. Si quieres contribuir, descarga el proyecto y sigue las intrucciones

#### Instalar dependencias
```
yarn install
```

#### Compilar para desarrollo
```
yarn serve
```

#### Compilar para producción
```
yarn build
```

#### Comprobación de errores y limpieza de código
```
yarn lint
