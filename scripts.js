$('#input-search').keyup(function(){
    let searchStr =  $('#input-search').val();
    const search = $('#search');

    if (searchStr.length>=2){
        $.ajax({
            url: '/search.php',
            type: 'POST',
            data: {'searchRequest': searchStr},
            dataType: 'html',
            success: function(data){
                const resultJson = JSON.parse(data);

                for (key in search){
                    while (search[key].firstChild) {
                        search[key].removeChild(search[key].firstChild);
                    }
                }

                resultJson.forEach(function (element) {
                    search.append(`<div class="search-results__item">${element.name}</div>`)
                })

            }
        })
    }
})