import { Ant } from "../../ant";
import { Dataset, DatasetContainer } from "../../utils/dataset";
import { Parser } from "../parserClass";

/**
 * represent the element with hook named "ant-download"
 *
 * @export
 * @class DownloadElement
 * @extends {Parser}
 */
export class DownloadElement extends Parser implements DatasetContainer{
    /**
     * property defined from [ ant-downlaod ]\n
     * URL of data
     *
     * @type {*}
     * @memberof DownloadElement
     */
    public url:string;
    /**
     * property defined from [ ant-downlaod_success ]\n
     * attribute to parse on succes data
     *
     * @type {*}
     * @memberof DownloadElement
     */
    public success:string;
    /**
     * property defined from [ ant-downlaod_format ]\n
     * format of the data : \n geojson,json,csv, etc
     *
     * @type {string}
     * @memberof DownloadElement
     */
    public format:string="json";

    /**
     * object stored data in the current format 
     *
     * @type {Dataset}
     * @memberof DatasetContainer
     */
    public dataset?:Dataset;

    /**
     * the key accesible for this dataset in scope ant.data
     *
     * @type {string}
     * @memberof DatasetContainer
     */
    public datasetScopeAccesible?:string;

    /**
     * indicates if dataset is ready
     *
     * @type {boolean}
     * @memberof DatasetContainer
     */
    public datasetIsReady:boolean=false;

    /**
     * Creates an instance of DownloadElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DownloadElement
     */
    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-download");
        this.setParserAttributes([
            {name:"",valueDefault:""}, //ant-download is required
            {name:"format",valueDefault:"json"}, //ant-download_format
            {name:"success",valueDefault:""}, //ant-download_success  (parse elements or call function in scope)
        ]);
        this.url=this.getAttributeValue(this.nameHook);
        this.format=this.getAttributeValue(this.nameHook+"_format");
        this.success=this.getAttributeValue(this.nameHook+"_success");
        this.loadData();
        
    }
    /**
     * send xhr request
     *
     * @private
     * @memberof DownloadElement
     */
    private loadData(){
        let req=new XMLHttpRequest();
        let th1=this;
        req.open("GET",this.url,true);
        req.onreadystatechange=function(){
            //on load all
            if(req.readyState==4){
                if(req.status==200){
                    //save dataset
                    th1.dataset=new Dataset(req.responseText,th1.format);
                    th1.datasetIsReady=true;
                    th1.datasetScopeAccesible=th1.id;
                    th1.getAnt().addItemToScope("data",th1.dataset,th1.datasetScopeAccesible);
                    //parse the elements
                    th1.getAnt().element.parseOrCallFnFromAttributeElement(th1.success,th1,th1.dataset);
                    
                }else{
                    console.warn("error on XMLHttpRequest "+th1.url);
                }
            }
        }
        req.send(null);
    }
}