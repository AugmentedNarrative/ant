import { Parser } from "../parserClass";
import { Ant } from "../../ant";
import { Dataset } from "../../utils/dataset";

/**
 *represent the element with hook named "ant-table"
 *
 * @export
 * @class TableElement
 * @extends {Parser}
 */
export class TableElement extends Parser{

    /**
     * property defined from [ ant-table_dataset ]\n
     * 
     *
     * @type {string}
     * @memberof TableElement
     */
    public dataset:string;

    /**
     * property defined from [ ant-table_columns ]\n
     *
     * @type {Array<string>}
     * @memberof TableElement
     */
    public columns:Array<string>;

    constructor(element:Element,ant:Ant) {
        super(element,ant,"ant-table");
        this.dataset=this.element.getAttribute(this.nameHook+"_dataset") || "";
        let columns1=this.element.getAttribute(this.nameHook+"_columns") || "";
        this.columns=(typeof columns1 == "string")? columns1.split(","):[""];
        //verify type Dataset object
        //selector, ant.data scope or url
        //selector for extract data or name of data in scope
        if(this.dataset.length>0){
            let dataset=Dataset.extractDatasetFromElementOrScope(this.getAnt(),this.dataset);
            if(dataset==null || dataset==undefined){
                console.warn("imposible read dataset from "+this.dataset+" in table "+this.id);
            }else{
                this.render(dataset);
            }
            
        }else{
            console.warn("dataset for table: "+this.id+" not defined")
        }
    }


    

    private render(dataset:Dataset){
        let columnasARenderear=(this.columns.length==1 && this.columns[0]=="")?dataset.columns:this.columns;
        let table;
        if(this.element.tagName=="table"){
            table=this.element;
        }else{
            table=document.createElement("table");
            this.element.appendChild(table);
        }
        let header=document.createElement("thead");
        let tbody=document.createElement("tbody");
        table.appendChild(header);
        table.appendChild(tbody);
        let header_tr=document.createElement("tr");
        header.appendChild(header_tr);

        columnasARenderear.forEach((columna)=>{
            let th1=document.createElement("th");
            th1.appendChild(document.createTextNode(columna));
            header_tr.appendChild(th1)
        });
        let rows=dataset.data.map((datasetRow)=>{
            //fill row
            let row=document.createElement("tr");
            columnasARenderear.forEach((col)=>{
                let celda=document.createElement("td")
                //fill cell
                let text=document.createTextNode(datasetRow.getValue(col)) 
                celda.appendChild(text);
                row.appendChild(celda);
            })
            return row;
        })
        rows.forEach((rr)=>{
            tbody.appendChild(rr);
        })
        //listo ya esta llena la tabla
    }


    

}