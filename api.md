welcome the ant api

## Parsers

- [ant-debug](#ant-debug)
- [ant-download](#ant-download)
- [ant-table](#ant-table)

### ant-debug
Shows message in the console when this element is parsed by Ant.

- **Hook name** ant-debug
- **Attributes**
    - **_message_**. defined in attribute: ``ant-debug``
        - *expected value:* message to show in console
        - *required*
- **Usage** 
```html 
<a ant-onload ant-debug="this message will be shown when loading the page"></a>
```

### ant-download
Get remote data and store in ANT scope

- **Hook name** ant-download
- **Attributes**
    - **_url_**. defined in attribute: ``ant-download``
        - *expected value:* url of data
        - *required*
    - **_format_**. defined in attribute: ``ant-download_format`` | ``ant-format``
        - *expected value:* data format: ``json`` | ``geojson`` | ``csv``
        - *optional*
        - *default value*: ``json``
    - **_success._** defined in attribute: ``ant-download_success`` | ``ant-success``
        - *expected value:* selectorCss of elements to parse when is success download | function name stored in ant.scope
        - *optional*
        - *default value*: ``""``
- **Usage** 

this example read data of http://mydata.com/data.geojson and parse element `#table1` on download success
```html 
<a ant-onload ant-downlaod="http://mydata.com/data.geojson" ant-format="geojson" ant-success="#table1"></a>
```
this example read data and call function ``finishDownload`` stored in Ant scope
```html 
<a ant-onload ant-downlaod="http://mydata.com/data.geojson" ant-format="geojson" ant-success="finishDownload"></a>
```
```javascript
var antInstance=new ant.Ant({
    callbacks:{
        finishDownload:function(response){
            //use response here
            //response.sender => get element that´s sender 
            //response.data => get espected data, in this case the dataset
        }
    }
});
```

### ant-table
Render a table in especific element

- **Hook name** ant-table
- **Attributes**
    - **_dataset_**. defined in attribute: ``ant-table_dataset`` | ``ant-dataset``
        - *expected value:* selectorCss of elements to parse that contains dataset e.g. ant-download element | dataset name stored in ant.scope
        - *required*
    - **_columns_**. defined in attribute: ``ant-table_columns`` | ``ant-columns``
        - *expected value:* list of columns to show e.g. ``"column1,column2,column3..."``
        - *optional*
        - *default value* ``""``
- **Usage** 

this example load data from ``ant-download`` parser, and render a table 
```html 
<a id="dataset1" ant-onload ant-downlaod="http://mydata.com/data.csv" ant-format="csv" ant-success="#table1"></a>

<table id="table1" ant-table ant-dataset="#dataset1" ant-columns="id,price,name"></table>
```


