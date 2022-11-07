import { LightningElement, api, wire } from 'lwc';
import getResourcesWrapper from '@salesforce/apex/ResourceService.getResourcesWrapper';
import registerResource from '@salesforce/apex/ResourceService.registerResource';

//Columnas a mostrar en la tabla
const columns = [
    { label: 'Name', fieldName: 'Name' },
    {
        label: 'Rate p/hour', fieldName: 'RatePerHour__c'
    },
    {
    label: 'Start Date',
    fieldName: 'dateApiNameSD',
    type: 'date-local',
    editable: true,
    typeAttributes: {
         year: "numeric",
         month: "2-digit",
         day: "2-digit"
     }
},{
    label: 'End Date',
    fieldName: 'dateApiNameED',
    type: 'date-local',
    editable: true,
    typeAttributes: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }
},
];

export default class ResourceAllocation extends LightningElement {
    @api recordId;
    columns = columns;
    recursos;
    recursosDeveloper;
    recursosArchitect;
    horas;
    hoursDev;
    hoursArch;
    draftValues=[];

    get hours(){
        return 'Consultant - Hours to cover: '+ this.horas +' hours';
    }

    get hoursdev(){
        return 'Developer - Hours to cover: '+ this.hoursDev +' hours';
    }

    get hoursarch(){
        return 'Architect - Hours to cover: '+ this.hoursArch +' hours';
    }
                                                                           
    @wire(getResourcesWrapper,{projectId: '$recordId', Role:'Consultant'})
       resource(Result){
        const { data, error } = Result;
        if (data) {
            this.recursos = data.resources;
            this.horas = data.project.ProjectLineItems__r[0].QuantityHours__c;
            console.log("DATA: "+this.recursos);
        } else if (error) {
            this.error = error;
        }
    }

     @wire(getResourcesWrapper,{projectId: '$recordId', Role:'Developer'})
       developer(ResultDev){
        const { data, error } = ResultDev;
        if (data) {
            this.recursosDeveloper = data.resources;
            this.hoursDev = data.project.ProjectLineItems__r[0].QuantityHours__c;
        } else if (error) {
            this.error = error;
        }
    }

    @wire(getResourcesWrapper,{projectId: '$recordId', Role:'Architect'})
       architect(ResultArch){
        const { data, error } = ResultArch;
        if (data) {
            this.recursosArchitect = data.resources;
            this.hoursArch = data.project.ProjectLineItems__r[0].QuantityHours__c;
        } else if (error) {
            this.error = error;
        }
    }

    handleSelectedRows(event){

        const rowsSelected=event.detail.selectedRows;
        const draftValues=event.target.draftValues;
       // console.log(draftValues);
        let eventAuxiliar=[];
        for(let i=0; i< rowsSelected.length; i++){
            //let array=draftValues.filter(elemento=> elemento.id=rowsSelected[i].id)
        //console.log(JSON.stringify(array))
            for(let j =0; j<draftValues.length;j++){
                if(draftValues[j].dateApiNameSD != null && draftValues[j].dateApiNameED != null ){
                    if(draftValues[j].Id==rowsSelected[i].Id){
                        eventAuxiliar.push(draftValues[j])
                    }
                }
            }

          //console.log(rowsSelected[i].Name + rowsSelected[i].Id + " " + JSON.stringify(draftValues));
        }

        console.log(eventAuxiliar);
        registerResource({selected:eventAuxiliar})
        .catch(error=> console.log(error + " Este es mi error"))
        
    }
}
// [{"dateApiNameSD":"2022-11-01","dateApiNameED":"2022-11-04","Id":"0054w00000BhH8JAAV"}]