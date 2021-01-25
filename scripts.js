const $searchResults = $('#search-results');
const $logs = $('.logs__list');
const $tbodyGoods = $('.description__examples tbody');
let $searchStr = $('#input-search').val();


const outputSearchResults = function (data, cb) {
    const dataArr = data.split('//');
    const goods = dataArr[0];
    const txtLogs = dataArr[1];
    if (data.length === 0) {
        cb($searchResults);
        return false;
    }

    if ($searchStr.length === 0) {
        return cb($searchResults);
    }


    const resultJson = JSON.parse(goods);

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

    if (txtLogs) {
        const txtFileJson = JSON.parse(txtLogs);
        outputContentFromTxt(txtFileJson);
    }

}

const outputContentFromTxt = function (data) {
    clearResults($logs);
    data.forEach(function (element) {
        $logs.append(`<li>${element}</li>`)
    })
}

const outputAllGoods = function (data) {
    if (data) {
        const goodsJson = JSON.parse(data);
        goodsJson.forEach(function (element) {
            $tbodyGoods.append(`
    <tr>
       <td>${element.id}</td>
       <td>${element.name}</td>
       <td>${element.number}</td>
       <td>${element.price}</td>
    </tr>`)
        })
    }
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

$(document).ready(function () {
    $.ajax({
        url: '/search.php',
        type: 'POST',
        data: {'documentReady': true},
        dataType: 'html',
        success: function (data) {
            outputAllGoods(data);

        }

    })
})


$('#input-search').keyup(function () {

    $searchStr = $(this).val();


    if ($searchStr.length != 0) {

        $.ajax({
            url: '/search.php',
            type: 'POST',
            data: {'searchRequest': $searchStr},
            dataType: 'html',
            success: function (data) {
                outputSearchResults(data, clearResults);

            }

        })
    } else {
        return clearResults($searchResults);
    }


})

$('.btn-insertBD').click(function () {
    $.ajax({
        url: '/search.php',
        type: 'POST',
        data: {'click': true},
        success: function (data) {
            if (data === '') {
                alert('txt файл пуст, введите хотя бы один запрос от 3-х символов');
            } else {
                alert(data);
                clearResults($logs);
            }


        }
    })
})

$('.btn-close').click(function () {
    $searchResults.each(function (index, searchResult) {
        if(searchResult.firstChild){
            clearResults($searchResults);
            $searchStr='';
        }
    })
    $('#input-search').val('');

})