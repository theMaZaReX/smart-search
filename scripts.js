const $searchResults = $('#search-results');
const $logs = $('.logs');
let $searchStr = $('#input-search').val();
$('.btn-insertBD').attr('disabled', true);



const outputSearchResults = function (data,cb) {
    const dataArr = data.split('//');
    const result = dataArr[0];
    const txtLogs = dataArr[1];
    if (data.length===0){
        cb($searchResults);
        return false;
    }

    if ($searchStr.length===0){
       return cb();
    }

   //const resultJson = JSON.parse(data);
    const resultJson = JSON.parse(result);
    const txtFileJson = JSON.parse(txtLogs);
    cb($searchResults);

    resultJson.forEach(function (element) {
        $searchResults.append(`
    <div class="search-results__item">
        <span class = "search-results__item-name">${element.name}:</span>
        <span class="search-results__item-price">${element.price} руб.,</span>
        <span class="search-results__item-count">кол-во: ${element.number} шт.</span>
    </div>`)
    })

    setHighlightText();
    outputContentFromTxt(txtFileJson);
}

const outputContentFromTxt = function (data) {
    clearResults($logs);
    data.forEach(function (element) {
        $logs.append(`<li>${element}</li>`)
    })
}

const setHighlightText = function () {
    $searchStr = $('#input-search').val();
    if ($searchResults.length != 0) {
        $('.search-results__item').each(function (i, resultItem) {
            let index = resultItem.textContent.toLowerCase().indexOf($searchStr);
            let lastIndex = index + $searchStr.length;
            let subStr = resultItem.textContent.substring(index, lastIndex);
            resultItem.innerHTML = resultItem.innerHTML.replace(subStr, `<strong>${subStr}</strong>`)
        });
    }
}

const clearResults = function (element) {

    element.each(function (i, item) {
            while (item.firstChild) {
                item.removeChild(item.firstChild);
            }
        })

}

$('#input-search').keyup(function () {

    $searchStr = $(this).val();


    if ($searchStr.length != 0) {
/*
        if ($searchStr.length >= 3) {
            $('.btn-insertBD').attr('disabled', false);
        } else {
            $('.btn-insertBD').attr('disabled', true);
        }
*/
        $.ajax({
            url: '/search.php',
            type: 'POST',
            data: {'searchRequest': $searchStr},
            dataType: 'html',
            success: function (data) {
                outputSearchResults(data, clearResults);

            }

        })
    }
        else{
           return clearResults($searchResults);
        }


})

$('.btn-insertBD').click(function () {
    $.ajax({
        url: '/search.php',
        type: 'POST',
        data: {'click': true},
        success: function (data) {
        alert('Логи загружены из txt файла в БД');
            $('.btn-insertBD').attr('disabled', true);
        }
    })
})

