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
        - *expected value:* selectorCss of elements to parse when is success download | function name of stored in ant.scope
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
