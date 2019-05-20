$('.like-btn').on('click', '#like-btn', function(event) {
	event.preventDefault();
	const id = $(this).attr('data-id');
	alert(id);
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

$(document).ready(function(){
  $(".dropdown-toggle").dropdown();
});
