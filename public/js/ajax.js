$('.like-btn').on('click', '#like-btn', function(event) {
	event.preventDefault();
	const id = $(this).attr('data-id');
	$.ajax({
		url: '/likes',
		method: 'POST',
		data:  JSON.stringify(id)
		}).done(function(res) {
				if (res.success) {
			console.log('id from ajax call is', res);
			window.location.reload();
		} else {
			console.log('error...ajax');
			}
	});
})

$('.checkbox').on('click', function() {
	const updateUrl = "/users/update";
    const isDone = !(task.data("completed"));
    const updateData = {isCompleted: isDone};
    $.ajax({
        method: "PUT",
        url: updateUrl,
        data: updateData
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
})

$(document).ready(function(){
  $(".dropdown-toggle").dropdown();
});
