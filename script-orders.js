function init() {
    console.log('Script order init');
    initButton();
    initOrderPageButton();
    //initButton2();

    // Select the node that will be observed for mutations
    let targetNode = document.querySelector("#panel1");
    let previousValue = 'none';
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };
    let lastVal = '-1';
    // Callback function to execute when mutations are observed
    const callback = (mutationList, observer) => {
        for (let mutation of mutationList) {

            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                let currentValue = mutation.target.style.display;
                if (currentValue !== previousValue) {
                    let currVal = mutation.target.style.opacity;
                    if (currVal === '' && !isNaN(parseFloat(lastVal))) {
                        console.log('!!!!!!!!!!!!!!!');
                        initButton();
                    }
                    lastVal = currVal;
                }
            }
            if (mutation.type === 'attributes') {
                initButton();
            }
        }

    };
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);
    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);


    //panel2observer
    let targetNode2 = document.querySelector('#panel2');
    let targetNode2PrevVal = 'none';
    const config2 = { attributes: true }

    const callback2 = (mutationList) => {
        for (let mutation of mutationList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                let targetNode2CurrVal = mutation.target.style.display;
                if (targetNode2CurrVal !== targetNode2PrevVal) {
                    console.log('panel2load');

                    setTimeout(() => { initOrderPageButton(); }, 500);
                }
            }
        }
    }

    const observerNode2 = new MutationObserver(callback2);
    observerNode2.observe(targetNode2, config2);


}

function initOrderPageButton() {
    let btnHtml = '<button class="btn btn-primary btn-extension">Edytuj wtyczką</button>';
    let targetTop = document.querySelector('#panel2 .mail-container-header');
    if (targetTop !== null) {
        targetTop = targetTop.querySelector('.pull-right.text-sm');
        targetTop.insertAdjacentHTML('beforeend', btnHtml);

        let buttonTop = targetTop.getElementsByClassName('btn-extension')[0];
        buttonTop.addEventListener('click', () => {
            console.log('click');
            openWindowInNewTabInOrder();
        });
    }

}

function openWindowInNewTabInOrder() {
    let url = 'http://91.208.133.170/8080/render/';
    let orderID = document.querySelector('.tip_trigger.pointer').textContent;
    window.open(url + orderID, '_blank').focus();
}



function initButton() {
    let btnHtml = '<button class="btn btn-primary btn-extension">Edytuj wtyczką</button>';
    let targetTop = document.querySelector('#table_controls_top .mail-controls');
    let targetBottom = document.querySelector('#table_controls_bottom .mail-controls');

    if (targetTop) {
        let buttonTop = targetTop.getElementsByClassName('btn-extension');
        if (buttonTop.length < 1) {
            console.log("EO")
            targetTop.insertAdjacentHTML('beforeend', btnHtml);
            buttonTop = targetTop.getElementsByClassName('btn-extension')[0];
            buttonTop.addEventListener('click', () => {
                openWindowInNewTab();
            });
        }

    }


    if (targetBottom) {

        let buttonBottom = targetBottom.getElementsByClassName('btn-extension');
        console.log('buttonBottom', buttonBottom);
        buttonBottom = targetBottom.getElementsByClassName('btn-extension');
        if (buttonBottom.length < 1) {
            console.log('lalala');
            targetBottom.insertAdjacentHTML('beforeend', btnHtml);
            buttonBottom = targetBottom.getElementsByClassName('btn-extension')[0];
            buttonBottom.addEventListener('click', () => { openWindowInNewTab() });
        } else if (buttonBottom.length === 1) {

            buttonBottom = targetBottom.getElementsByClassName('btn-extension')[0].remove();
            //recreateNode(buttonBottom)
            targetBottom.insertAdjacentHTML('beforeend', btnHtml);
            buttonBottom = targetBottom.getElementsByClassName('btn-extension')[0];
            buttonBottom.addEventListener('click', () => { openWindowInNewTab() });
        }

        //document.querySelectorAll("btn-extension")[1].remove()
    }
}
// function initButton2()
// {
//     let btnHtml = '<button class="btn btn-primary btn-extension">Edytuj wtyczką</button>';
//     let targetTop = document.querySelector('.mail-container-header').querySelector('.pull-right.text-sm')
//     targetTop.insertAdjacentHTML('beforeend', btnHtml);

//     buttonTop = targetTop.getElementsByClassName('btn-extension')[0];                 
//     buttonTop.addEventListener('click', () => {
//         openWindowInNewTabInOrder();
//     });
// }

function recreateNode(el, withChildren) {
    if (withChildren) {
        el.parentNode.replaceChild(el.cloneNode(true), el);
    }
    else {
        var newEl = el.cloneNode(false);
        while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
        el.parentNode.replaceChild(newEl, el);
    }
}

function openWindowInNewTab() {
    let url = 'http://91.208.133.170/8080/render/';
    let selectedRows = document.querySelectorAll('.row_selected');
    if (selectedRows.length === 0) {
    } else if (selectedRows.length > 1) {
        alert('Zbyt wiele wybranych zamówień. Wybierz jedno.');
    } else {
        let selectedRow = selectedRows[0];
        let orderId = selectedRow.id.split('_')[1];
        window.open(url + orderId, '_blank').focus();
    }
}
// function openWindowInNewTabInOrder() {
//     let url = 'http://vps-484243a4.vps.ovh.net:8080/render/';
//     let orderID = document.querySelector('.mail-container-header').querySelector('.tip_trigger').firstChild.nodeValue
//     window.open(url + orderID, '_blank').focus();
// }

setTimeout(() => {
    init();
}, 500);