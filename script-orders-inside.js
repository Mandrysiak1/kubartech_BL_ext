
function initProductPage() {
    console.log('Script order init inside 111');
    initButton();
}

function initOrderPageButton()
{
    let btnHtml = '<button class="btn btn-primary btn-extension">Edytuj wtyczką</button>';
    let targetTop = document.querySelector('.mail-container-header').querySelector('.pull-right.text-sm')
    targetTop.insertAdjacentHTML('beforeend', btnHtml);

    buttonTop = targetTop.getElementsByClassName('btn-extension')[0];                 
    buttonTop.addEventListener('click', () => {
        openWindowInNewTabInOrder();
    });
}

function openWindowInNewTabInOrder() {
    let url = 'http://vps-484243a4.vps.ovh.net:8080/render/';
    let orderID = document.querySelector('.tip_trigger.pointer').textContent;
    window.open(url + orderID, '_blank').focus();
}

setTimeout(() => {
    initProductPage();
}, 500);
