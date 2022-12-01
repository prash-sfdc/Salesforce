public with sharing class toDoController 
{
    @AuraEnabled
    public static String addTodo(String payload) 
    {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);
  
        SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
        todo.put('Name', payloadObject.todoName);
        todo.put('Done__c', payloadObject.done);
  
        insert todo;
  
        return String.valueOf(todo.Id);
    }

    @AuraEnabled
    public static void updateTodo(String payload) 
    {
        ToDo payloadObject = (ToDo) JSON.deserialize(payload, ToDo.class);

        SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
        todo.put('Id', payloadObject.todoId);
        todo.put('Name', payloadObject.todoName);
        todo.put('Done__c', payloadObject.done);

        update todo;
    }

    @AuraEnabled
    public static void deleteTodo(String todoId) 
    {
        SObject todo = (Sobject) Type.forName('ToDo__c').newInstance();
        todo.put('Id', todoId);

        delete todo;
    }

    @AuraEnabled(cacheable=true)
    public static List<ToDo> getAllTodos() 
    {
        List<SObject> todos = Database.query('SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC');

        return getToDos(todos);
    }

    @AuraEnabled
    public static List<ToDo> getCurrentTodos() 
    {
        List<SObject> todos = Database.query('SELECT Id, Name, CreatedDate, Done__c FROM ToDo__c WHERE CreatedDate = TODAY ORDER BY CreatedDate DESC');
    
        return getToDos(todos);
    }

    public static List<ToDo> getToDos(List<SObject> objs) 
    {
        List<ToDo> todos = new List<ToDo>();
        for (SObject obj : objs) 
        {
            ToDo todo = new ToDo();
            todo.todoId = obj.Id;
            todo.todoName = String.valueOf(obj.get('Name'));
            todo.todoDate = Date.valueOf(obj.get('CreatedDate'));
            todo.done = Boolean.valueOf(obj.get('Done__c'));
            todos.add(todo);
        }
        return todos;
    }

    public class ToDo 
    {
        @AuraEnabled
        public String todoId;
        @AuraEnabled
        public String todoName;
        @AuraEnabled
        public Date todoDate;
        @AuraEnabled
        public Boolean done;
    }
}

