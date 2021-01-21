const $search = $('#search');
$('.btn').attr('disabled', true);


const outputSearchResults = function(data){
    const resultJson = JSON.parse(data);

    clearSearchResults();

    resultJson.forEach(function (element) {
        $search.append(`
    <div class="search-results__item">${element.name}
        <span class="search-results__item-price">Цена: ${element.price} руб.</span>
        <span class="search-results__item-count">Кол-во: ${element.number} шт.</span>
    </div>`)
 })

    setHighlightText();

}

const setHighlightText = function(){
    const $searchStr = $('#input-search').val();
    if ($search.length != 0) {
        $('.search-results__item').each(function (i, resultItem) {
            let index = resultItem.textContent.toLowerCase().indexOf($searchStr);
            let lastIndex = index + $searchStr.length;
            let subStr = resultItem.textContent.substring(index, lastIndex);
            resultItem.innerHTML = resultItem.innerHTML.replace(subStr, `<strong>${subStr}</strong>`)
        });
    }
}

const clearSearchResults = function (){
    $search.each(function (i, item) {
        while (item.firstChild) {
            item.removeChild(item.firstChild);
        }
    })
}

$('#input-search').keyup(function () {

    const $searchStr = $(this).val();


        if ($searchStr.length != 0) {

          if($searchStr.length>=3){
              $('.btn').attr('disabled', false);
          }
          else{
              $('.btn').attr('disabled', true);
          }

        $.ajax({
            url: '/search.php',
            type: 'POST',
            data: {'searchRequest': $searchStr},
            dataType: 'html',
            success: function (data) {
                outputSearchResults(data, $searchStr);
            }
        })
    }
    else{
        clearSearchResults();
    }

})

$('.btn').click(function () {
    $.ajax({
        url: '/search.php',
        type: 'POST',
        data: {'click': true}
    })
})

