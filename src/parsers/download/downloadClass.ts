import { Parser } from "../parserClass";
import { Ant } from "../../ant";

/**
 * parser ant-download
 */
export class DownloadElement extends Parser{
    public url:any;
    public onSuccess:any;
    public format:string="json";
    
    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-download");
        this.url=this.element.getAttribute(this.nameHook);
        this.format=(this.element.getAttribute(this.nameHook+"_format") == null )?"json":<string>(this.element.getAttribute(this.nameHook+"_format"));
        this.onSuccess=this.element.getAttribute(this.nameHook+"_onSuccess");
        this.cargarDatos();
    }
    private cargarDatos(){
        let req=new XMLHttpRequest();
        let th1=this;
        req.open("GET",this.url,true);
        req.onreadystatechange=function(){
            //cuando se carga completamente
            if(req.readyState==4){
                //cuando se trajo el contenido correctamente
                if(req.status==200){
                    //parsear los elementos que 
                    let elementos=document.querySelectorAll(th1.onSuccess);
                    elementos.forEach((ele)=>{
                        th1.ant.element.parse(ele);
                    });
                    console.log(req.responseText);
                }else{
                    console.warn("error al cargar la peticion");
                }
            }
        }
        req.send(null);
    }
}