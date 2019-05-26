$( document ).ready(function() {
    
    console.log( $('.form-check').is(":checked"));
    function updateTodo(task) {
        console.log(task[0].attributes[1].ownerElement.checked);
        //console.log(Object.getOwnPropertyNames(task));
        const updateUrl = "/users/notification/" + task[0].attributes[1].ownerElement.checked;
        const isDone = !(task[0].attributes[1].ownerElement.checked);
        const updateData = {isCompleted: isDone};
        $.ajax({
            method: "POST",
            url: updateUrl,
            data: task[0].attributes[1].ownerElement.checked
        })
            .then(function (todo) {
                console.log(todo);
                task.toggleClass("done");
                task.data("completed", isDone);
                console.log("task Data completed:" + task.data("completed"));
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    
    $(".form-check").on("click", "input", function () {
       // console.log( 'This is the console ' + $('.form-check'));
        if($(".form-check").is("checked") == true){
            $(".form-check").attribute("checked", false);
        }else{
            $(".form-check").prop("checked", true);
        }
        updateTodo($(this));
    });
   
       
  
});

