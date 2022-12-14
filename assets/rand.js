const specialBtn = document.getElementById('special__btn')
addEventListener('DOMContentLoaded', init)

function init() {
    var pagesEndpoint=`${window.location.origin}/pages.json`;
    getPages(pagesEndpoint)
}

async function getPages(pagesEndpoint){
    var endpoint = await fetch(pagesEndpoint);
    var result = await endpoint.json();
    var datas = result.pages;
    var extractHandle = [];

    for(var i=0;i<datas.length;i++) {
        var handle = datas[i].handle;
        var splitH = handle.split('-')
        if(splitH[0] == 'goto') {
            extractHandle.push(handle)
        }
    }

    // check session storage
    switch(true) {
        case sessionStorage.hasOwnProperty("fritter_page_urls"):
            console.log('sessionStorage HAS a key of "fritter_page_urls"')
            // getSession();
            break;
        case !sessionStorage.hasOwnProperty("fritter_page_urls"):
            console.log('sessionStorage DOES NOT HAVE a key of "fritter_page_urls" and we should set it!')
            setSession(extractHandle)
            break;
    }
}

function setSession(extractHandle) {
    var urls = JSON.stringify(extractHandle)
    sessionStorage.setItem("fritter_page_urls", urls)
}

// function getSession() {
//     var getUrls = sessionStorage.getItem("fritter_page_urls")
//     var parsed = JSON.parse(getUrls)
//     console.log(parsed, 'items set')
// }

specialBtn.addEventListener('click', (e) => {
    var parsingData = JSON.parse(sessionStorage.getItem("fritter_page_urls"))

    var storeIndex = '' // store the index that will be removed
    var newData = []; // to be passed at sessionStorage

    if(parsingData.length !== 0) {
        var indexRandomizer = Math.floor(Math.random() * parsingData.length)
        
        for(var i = 0; i < parsingData.length; i++) {
            if(i == indexRandomizer) {
                storeIndex = parsingData[i]
            } else {
                newData.push(parsingData[i])
            }
        }
    }

    var gotoUrl = `${window.location.origin}/pages/${storeIndex}`
    console.log('redirect to this page: ', gotoUrl)

    // remove fritter_page_urls data and replace it with the new data
    sessionStorage.removeItem("fritter_page_urls")

    if(newData.length !== 0) {
        // check if the new data array is not empty
        sessionStorage.setItem('fritter_page_urls', JSON.stringify(newData))
        console.log('new data to be sent to the session storage', newData)
    }

    setTimeout(() => {
        alert('redirecting to ' + gotoUrl)
        window.location.href = gotoUrl
    }, 150)
})
