import { Ant } from "../ant";

export class Dataset {
    data:Array<RowDataset>;
    format:string;
    isGeometry:boolean;
    columns:Array<string>=[""];
    pureJson!:any;
    
    constructor(data:string,format="json") {
        this.format=format;
        if(format=="geojson"){
            let data1=JSON.parse(data);
            this.pureJson=data1
            this.data=data1.features.map((feature:any)=>{
                return new RowDataset(feature,format);
            });
            this.isGeometry=true
        }else if(format=="csv"){
            console.info("necesitamos crear un parser para tablas en formato csv")
            let data1=[""];
            this.data=data1.map((feature:any)=>{
                return new RowDataset(feature,format);
            });
            this.isGeometry=true
        }else{
            let data1=JSON.parse(data);
            this.data=data1.map((item:any)=>{
                return new RowDataset(item,format);
            });
            this.isGeometry=false
        }

        if(this.data.length>0){
            this.columns=this.data[0].keys;
        }
        
    }

    public static extractDatasetFromElementOrScope(ant:Ant,dataset_attr:string):Dataset|null{
        let elems=document.querySelectorAll(dataset_attr);
        
        let datasetReturn:Dataset|null=null;
        //debugger
        if(elems.length>0){
            elems.forEach((telem)=>{
                //verify if this element contains parsers 
                let accesibles:string=telem.getAttribute("ant___0initparse") || "";
                if(accesibles.length>0){
                    let hooks=accesibles.split(",");
                    hooks.forEach((hook)=>{
                        let acces=hook.split(":");
                        let obj=ant.scope.elements[acces[1]];
                        //verify instance with dataset
                        if("datasetIsReady" in obj && "dataset" in obj){
                            datasetReturn=obj.dataset;
                        }
                        
                    });
                }
            });
        }

        if(datasetReturn==null){
            datasetReturn=this.extractDatasetFromScope(ant,dataset_attr);
        }

        return  datasetReturn;
        
    }

    public static extractDatasetFromScope(ant:Ant,key:string){
        let data=ant.scope.data[key];
        if(data instanceof Dataset){
            return ant.scope.data[key];
        }else{
            let newDataset=new Dataset(JSON.stringify(data),"json")
            return newDataset;
        }
        
    }

}


export class RowDataset{
    public keys:Array<string>=[];
    public object:any={};
    public geometry:any=null;

    constructor(object:any,format="json"){
        if(format=="geojson"){
            this.geometry=object.geometry;
            this.initKeys(object.properties);
            this.object=object.properties;
        }else{
            this.initKeys(object);
            this.object=object;
        }
    }

    private initKeys(object:any,omitirKey:string=""){
        for(let key in object){
            this.keys.push(key);
        }
    }

    public getValue(key:string):any{
        //debugger
        //console.log(key,this.object);
        return this.object[key];
    }
}


export interface DatasetContainer{
    dataset?:Dataset,
    datasetScopeAccesible?:string,
    datasetIsReady:boolean
}