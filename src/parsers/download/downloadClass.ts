import { Parser } from "../parserClass";
import { Ant } from "../../ant";

/**
 *represent the element with hook named "ant-download"
 *
 * @export
 * @class DownloadElement
 * @extends {Parser}
 */
export class DownloadElement extends Parser{
    /**
     *URL of data
     *
     * @type {*}
     * @memberof DownloadElement
     */
    public url:any;
    /**
     *attribute to parse on succes data
     *
     * @type {*}
     * @memberof DownloadElement
     */
    public onSuccess:any;
    /**
     *format of the data : \n geojson,json,csv, etc
     *
     * @type {string}
     * @memberof DownloadElement
     */
    public format:string="json";
    /**
     * Creates an instance of DownloadElement.
     * @param {Element} element HtmlElement
     * @param {Ant} ant instance of ant main object
     * @memberof DownloadElement
     */
    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-download");
        this.url=this.element.getAttribute(this.nameHook);
        this.format=(this.element.getAttribute(this.nameHook+"_format") == null )?"json":<string>(this.element.getAttribute(this.nameHook+"_format"));
        this.onSuccess=this.element.getAttribute(this.nameHook+"_success");
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
                    //parse the elements
                    let elementos=document.querySelectorAll(th1.onSuccess);
                    elementos.forEach((ele)=>{
                        th1.ant.element.parse(ele);
                    });
                    console.log(req.responseText);
                }else{
                    console.warn("error on XMLHttpRequest "+th1.url);
                }
            }
        }
        req.send(null);
    }
}