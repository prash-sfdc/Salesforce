public with sharing class toDoSearchClass 
{
    @AuraEnabled(Cacheable = true)
    public static list<ToDo__c> getTodoData(String textkey) 
    {
        textkey = '%' + textkey + '%';
        list<ToDo__c> todoList = [SELECT Name, Id, Done__c FROM ToDo__c WHERE Name LIKE :textkey];
     
        if(todoList.isEmpty()) 
        {
            throw new AuraHandledException('No Data Found..');
        }
        return todoList; 
    }    
}
