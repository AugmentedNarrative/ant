
export class Dataset {
    data:Array<RowDataset>;
    format:string;
    isGeometry:boolean;
    columns:Array<string>=[""];
    jsonVirgen!:any;
    
    constructor(data:string,format="json") {
        this.format=format;
        if(format=="geojson"){
            let data1=JSON.parse(data);
            this.jsonVirgen=data1
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
