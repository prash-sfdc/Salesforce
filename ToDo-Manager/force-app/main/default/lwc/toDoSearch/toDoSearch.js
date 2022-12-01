import { LightningElement, track} from 'lwc';
import getTodoData from '@salesforce/apex/toDoSearchClass.getTodoData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ToDoSearch extends LightningElement 
{
    searchKey;
    @track todos;

    //This Funcation will get the value from Text Input.
    handelSearchKey(event)
    {
        this.searchKey = event.target.value;
    }

    //This funcation will fetch the Account Name on basis of searchkey
    SearchAccountHandler()
    {
        //call Apex method.
        getTodoData({textkey: this.searchKey})
        .then(result => {
                        this.todos = result;
                        })
        .catch( error=>{
                        this.todos = null;
                        //console.log("No items related to the search in the toDo database");
                        const toastEvent = new ShowToastEvent({
                            message: 'No items related to the search found',
                            variant: 'error',
                        });
                        this.dispatchEvent(toastEvent);
        });
    }

    cols = [
            {label:'ToDo Name: ', fieldName:'Name' , type:'text'} ,
            {label:'ToDo ID: ', fieldName:'Id'} ,
            {label:'Done Status: ', fieldName:'Done__c' , type:'checkbox'}
            ];
}
