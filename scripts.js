$('#input-search').keyup(function () {
    let $searchStr = $('#input-search').val();
    const search = $('#search');

    if ($searchStr.length >= 2) {
        $.ajax({
            url: '/search.php',
            type: 'POST',
            data: {'searchRequest': $searchStr},
            dataType: 'html',
            success: function (data) {
                const resultJson = JSON.parse(data);

                search.each(function (i, item) {
                    while (item.firstChild) {
                        item.removeChild(item.firstChild);
                    }
                })

                resultJson.forEach(function (element) {
                    search.append(`<div class="search-results__item">${element.name}</div>`)
                })

                if (search.length != 0) {
                    $('.search-results__item').each(function (i, resultItem) {
                        let index = resultItem.textContent.toLowerCase().indexOf($searchStr);
                        let lastIndex = index + $searchStr.length;
                        let subStr = resultItem.textContent.substring(index, lastIndex);
                        resultItem.innerHTML = resultItem.innerHTML.replace(subStr, `<strong>${subStr}</strong>`)
                    });
                }

            }
        })
    }
})