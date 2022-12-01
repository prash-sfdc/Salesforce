import { LightningElement, track} from 'lwc';
import addTodo from "@salesforce/apex/toDoController.addTodo"
import getCurrentTodos from "@salesforce/apex/toDoController.getCurrentTodos"

export default class ToDoManager extends LightningElement 
{
    @track time = "12:12 PM";
    @track greeting = "Good Evening";
    @track todos = [];

    connectedCallback()
    {
        this.getTime();
        //this.populateTodos();
        this.fetchTodos();

        setInterval(() => {
            this.getTime();
            //console.log("SetInterval() called");
          }, 1000);
    }
    
    getTime()
    {
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();
        const seconds = date.getSeconds();
        
        this.time = `${this.gethour(hour)}:${this.getDoubeDigit(min)}:${this.getDoubeDigit(seconds)} ${this.getMidDay(hour)}`; 
        this.setGreeting(hour);
    }

    gethour(hour)
    {
        return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    }

    getMidDay(hour)
    {
        return hour >= 12 ? "PM" : "AM";
    }

    getDoubeDigit(digit)
    {
        return digit < 10 ? "0" + digit : digit;
    }

    setGreeting(hour)
    {
        if(hour < 12)
            this.greeting = "Good Morning";
        else if(hour ==12 && hour < 17)
            this.greeting = "Good Afternoon";
        else
            this.greeting = "Good Evening";

    }

    addTodoHandler()
    {
        const inputBox = this.template.querySelector("lightning-input");
        //console.log('current value: '+inputBox.value);
        
        const todo = {
            //todoId : this.todos.length,
            todoName : inputBox.value,
            done : false,
            //todoDate : new Date()
        };
        addTodo({payload : JSON.stringify(todo)})
        .then(result =>{
            if(result)
            {
                //console.log("Item inserted succcessfully"+result)
                this.fetchTodos();
            }
        })
        .catch(error =>{
            console.error("Error in inserting toDo item"+error)});
        
        //this.todos.push(todo);
        inputBox.value = "";
    }

    get upcomingTodos()
    {
        return this.todos && this.todos.length ? this.todos.filter(todo=> !todo.done) : []; 
    }

    get completedTodos()
    {
        return this.todos && this.todos.length ? this.todos.filter(todo=> todo.done) : []; 
    }

    fetchTodos()
    {
        getCurrentTodos().then(result=>{
            if(result)
            {
                //console.log("retreived todos from server"+result)
                this.todos = result;
            }
            })
            .catch(error=>{console.error("error in fetching todo"+error);});
    }

    updateTodoHandler()
    {
        this.fetchTodos();
    }

    deleteTodoHandler()
    {
        this.fetchTodos();
    }

    // populateTodos()
    // {
    //     const todos =
    //     [{
    //         todoId: 0,
    //         todoName: "Feed the dog",
    //         done: false,
    //         todoDate: new Date()
    //      },
    //      {
    //         todoId: 1,
    //         todoName: "Feed the cat",
    //         done: false,
    //         todoDate: new Date()
    //      },
    //      {
    //         todoId: 2,
    //         todoName: "Feed the cow",
    //         done: true,
    //         todoDate: new Date()
    //      }];
    //      this.todos = todos;
         
        
    // }
}