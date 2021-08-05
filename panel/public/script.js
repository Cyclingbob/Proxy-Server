function format_request_params(data){

    var newdata = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');

    return newdata

}

function send_data(data, url, method, callback){    

    const newdata = format_request_params(data)

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            callback(xhr.responseText)

        }

    };

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(newdata);
}

function get_form_data(data){

    data = Object.entries(data)

    var newdata = {}

    data.forEach(item => {

        item = item[1]

        if(item.name !== ''){

            newdata[item.name] = item.value

        }
    })

    return newdata

}

function login(e){

    e.preventDefault()    

    send_data(get_form_data(e.target), '/login', 'POST', function(response){
        
        if(response === 'ok'){

            window.location = '/'

        }

    })

}

var loginForm = document.getElementById('login-form')
if(loginForm) loginForm.addEventListener('submit', login)

function create_domain_record(data){

    var li = document.createElement('li')

    var domain = document.createElement('span')
    var ip = document.createElement('span')
    var port = document.createElement('span')

    domain.innerHTML = data.domain
    ip.innerHTML = data.ip
    port.innerHTML = data.port

    li.appendChild(domain)
    li.innerHTML = li.innerHTML + ' => '    
    li.appendChild(ip)
    li.innerHTML = li.innerHTML + ':'    
    li.appendChild(port)

    document.getElementById('logs').appendChild(li)

}

function find_logs(e){

    e.preventDefault()

    send_data(get_form_data(e.target), '/logs/find', 'POST', function(response){

        response = JSON.parse(response)
        
        if(response.status === 'ok'){

            

        }

    })

}

function add_domain(e){

    e.preventDefault()

    send_data(get_form_data(e.target), '/domain/add', 'POST', function(response){
        
        if(response === 'ok'){

            console.log(get_form_data(e.target))

            create_domain_record(get_form_data(e.target))

        }

    })

}

var addForm = document.getElementById('add-form')
if(addForm) addForm.addEventListener('submit', add_domain)

function remove_domain(domain){

    send_data({ domain }, '/domain/delete', 'POST', function(response){

        if(response === 'ok'){

            var id = list.find(x => x.domain === domain).id

            document.getElementById(id.toString()).remove()
            
        }

    })

}

function block(element, ip){

    send_data({ ip }, '/ip/block', 'POST', function(response){

        if(!element) return;

        if(response === 'ok'){

            if(!element) return;           

            var parent = element.parentNode.parentNode
            parent.remove()

            var blocked = document.getElementById('blocked')
            var tr = document.createElement('tr')

            var td = document.createElement('td')
            var span = document.createElement('span')
            span.className = 'ip'
            span.innerHTML = ip
            
            tr.appendChild(td)
            td.appendChild(span)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="whitelist(this, '${ip}')">Whitelist</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="challenge(this, '${ip}')">Challenge</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="js_challenge(this, '${ip}')">JS Challenge</button>`
            tr.appendChild(td)

            blocked.lastElementChild.firstElementChild.appendChild(tr)
            
        }

    })

}

function challenge(element, ip){

    send_data({ ip }, '/ip/challenge', 'POST', function(response){

        if(response === 'ok'){

            var parent = element.parentNode.parentNode
            parent.remove()
            
            var challenged = document.getElementById('challenge')
            var tr = document.createElement('tr')

            var td = document.createElement('td')
            var span = document.createElement('span')
            span.className = 'ip'
            span.innerHTML = ip
            
            tr.appendChild(td)
            td.appendChild(span)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="block(this, '${ip}')">Block</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="whitelist(this, '${ip}')">Whitelist</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="js_challenge(this, '${ip}')">JS Challenge</button>`
            tr.appendChild(td)

            challenged.lastElementChild.firstElementChild.appendChild(tr)

        }

    })

}

function js_challenge(element, ip){

    send_data({ ip }, '/ip/js_challenge', 'POST', function(response){

        if(response === 'ok'){

            var parent = element.parentNode.parentNode
            parent.remove()

            var js_challenged = document.getElementById('js_challenge')
            var tr = document.createElement('tr')

            var td = document.createElement('td')
            var span = document.createElement('span')
            span.className = 'ip'
            span.innerHTML = ip
            
            tr.appendChild(td)
            td.appendChild(span)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="block(this, '${ip}')">Block</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="whitelist(this, '${ip}')">Whitelist</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="challenge(this, '${ip}')">Challenge</button>`
            tr.appendChild(td)

            js_challenged.lastElementChild.firstElementChild.appendChild(tr)
            
        }

    })

}

function whitelist(element, ip){

    send_data({ ip }, '/ip/whitelist', 'POST', function(response){

        if(response === 'ok'){

            var parent = element.parentNode.parentNode
            parent.remove()

            var allowed = document.getElementById('allowed')
            var tr = document.createElement('tr')

            var td = document.createElement('td')
            var span = document.createElement('span')
            span.className = 'ip'
            span.innerHTML = ip
            
            tr.appendChild(td)
            td.appendChild(span)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="block(this, '${ip}')">Block</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="challenge(this, '${ip}')">Challenge</button>`
            tr.appendChild(td)

            td = document.createElement('td')
            td.innerHTML = `<button onclick="js_challenge(this, '${ip}')">JS Challenge</button>`
            tr.appendChild(td)

            allowed.lastElementChild.firstElementChild.appendChild(tr)
            
        }

    })

}

function openTab(evt, cityName) {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {

      tabcontent[i].style.display = "none";

    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {

      tablinks[i].className = tablinks[i].className.replace(" active", "");

    }

    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";

}

function block_form(e){

    e.preventDefault()

    var ip = get_form_data(e.target).ip

    block(undefined, ip)

    var blocked = document.getElementById('blocked')
    var tr = document.createElement('tr')

    var td = document.createElement('td')
    var span = document.createElement('span')
    span.className = 'ip'
    span.innerHTML = ip
    
    tr.appendChild(td)
    td.appendChild(span)

    td = document.createElement('td')
    td.innerHTML = `<button onclick="whitelist(this, '${ip}')">Whitelist</button>`
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = `<button onclick="challenge(this, '${ip}')">Challenge</button>`
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerHTML = `<button onclick="js_challenge(this, '${ip}')">JS Challenge</button>`
    tr.appendChild(td)

    blocked.lastElementChild.firstElementChild.appendChild(tr)
    
}

function search_ip(e){
    
    e.preventDefault()

    send_data(get_form_data(e.target), '/ip/search', 'POST', function(response){

        response = JSON.parse(response)

        console.log(response)

    })
}

var blockForm = document.getElementById('block-form')
if(blockForm) blockForm.addEventListener('submit', block_form)

var list = []

var i = -1

if(document.getElementById('logs')){

    Array.from(document.getElementById('logs').children).forEach(element => {

        var item = {}
    
        Array.from(element.children).forEach(inner_element => {
            
            item[inner_element.className] = inner_element.innerHTML
    
        })
    
        i++
    
        element.id = i
    
        item.id = i
    
        list.push(item)
    
    })

    var form = document.getElementById('search-form')
    if(form) form.addEventListener('submit', function(e){

        e.preventDefault()

        send_data(get_form_data(e.target), '/logs/sort', 'POST', function(response){

            document.getElementById('logs').innerHTML = response
    
        })
    })
}

if(window.location.pathname === '/logs') {

    document.getElementsByClassName('logs')[0].scroll(0, document.getElementsByClassName('logs')[0].scrollHeight)

}

if(window.location.pathname === '/ip'){

    var form = document.getElementById('search-form')
    if(form) form.addEventListener('submit', search_ip)

    openTab(event, 'allowed')

}
