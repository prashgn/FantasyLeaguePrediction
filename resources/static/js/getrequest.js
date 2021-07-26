$( document ).ready(function() {
	
	// GET REQUEST
	$("#allCustomers").click(function(event){
		//event.preventDefault();
		//ajaxGet();
        /*
        $.ajax({
			type : "GET",
			url : "/profiles",
            success: function(result){
            //do something with the data via front-end framework
                  alert("result");
            location.reload();
            },
			error : function(e) {
				$("#getResultDiv").html("<strong>Error</strong>");
				console.log("ERROR: ", e);
			}
		});	*/
	});
	 
	// DO GET
	/*
    function ajaxGet(){
        alert("assasa");
        alert(result);
		
	} */
})

/*
success: function(result){
				$('#getResultDiv ul').empty();
				var custList = "";
				$.each(result, function(i, customer){
					$('#getResultDiv .list-group').append(customer.id + ". " + customer.username + " " + customer.email + "<br>")
				});
				console.log("Success: ", result);
			},
*/