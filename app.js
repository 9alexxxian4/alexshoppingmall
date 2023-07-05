let openShopping = document.querySelector('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCard');
let body = document.body;
let html = document.html;
let total = document.querySelector('.total');
let quantity = document.querySelector('.quantity');
let priceUp = document.querySelector('.priceUp');
let priceDown = document.querySelector('.priceDown');
let less = document.querySelector('.less');
let reset = document.querySelector('.reset');
let container = document.querySelector('.container');
let input = document.querySelectorAll('.item button');
let more = document.querySelector('.more');

// 장바구니 누르면 오른쪽화면에서 장바구니 나오는 버튼
openShopping.addEventListener('click', ()=>{
    body.classList.add('active');
})
// 장바구니 화면에서 close 누르면 닫히는 버튼
closeShopping.addEventListener('click', ()=>{
    body.classList.remove('active');
})
// input(담기),shopping(장바구니img & 빨간색원 수량),filter_btn(가격 오름,내름순&20,000원 이하)
// 장바구니가 켜진 상태에서 close 버튼뿐만 아니라 장바구니를 제외한 영역을 눌렀을때
// 장바구니가 닫히게끔 하기위해 input,shopping,filter_btn 부분을 제외한 영역을
// 눌렀을때 장바구니 닫히게 하는 코드
container.addEventListener('click', (e)=> {
    if(!e.target.classList.contains('input')
    && !e.target.closest('.shopping')
    && !e.target.classList.contains('shopping')
    && !e.target.classList.contains('filter_btn')
    ){
        body.classList.remove('active');
    }
    // console.log(e.target);
});

// products 객체 // 첫화면에 나올 img와 text 객체
let products = [
    {
        id: 1,
        name: '먹고싶니?',
        image: 'img/1.PNG',
        price: 20000
    },
    {
        id: 2,
        name: '나도 먹고싶다',
        image: 'img/2.PNG',
        price: 16000
    },
    {
        id: 3,
        name: '뭐 먹고싶니?',
        image: 'img/3.PNG',
        price: 22000
    }
];
console.log(products);
// products 객체를 가지고 forEach로 돌린후
// createElement('div')로 HTML에 div태그를 생성한후
// classList.add('item')으로 class 이름 지정하고
// toLocaleString은 숫자열에 ,(콤마)를 찍어주는 메서드사용하고
// 화면에 appendChild로 뿌려주는 코드
function initApp(products){
    products.forEach((value, key) =>{
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">${value.price.toLocaleString()}</div> 
            <button class="input" onclick="addToCard(${value.id -1})">담기</button>`;
        list.appendChild(newDiv);
    })
}
// initApp(products)함수 실행(products 객체 화면에 뿌려주는 코드)
initApp(products);
// json파일을 가져오기 위한 함수
// 주소내에서 site 부분만 변경이 되므로 매개변수 선언후
// 더보기 버튼을 눌렀을때, 매개변수로 불러올 수 있음.
function temp(site){
    new Promise(function (receive) {
        fetch(`https://9alexxxian4.github.io/morealex.github.io/${site}`,
            {
                headers: {
                Accept: "application / json",
                },
                method: "GET",
            })
           // json 파일 읽어오기
            .then((response) => response.json()) // 읽어온 데이터를 json으로 변환
            .then((data) => { 
                initApp(data);
                receive(JSON.stringify(data));  // json파일을 텍스트로
                for(i = 0; i<data.length; i++) {
                    products.push(data[i]);
                }
            });
        });
    count++;
}
// productsd의 key값을 넣어주기위한 배열 생성.
let listCards  = [];
// 담기버튼을 눌렀을때, listCards 빈 배열에 products 객체에 key값을 넣어주는 함수
// listCards[key]값이 null(없다)이면 products 객체 key값으로 담아주고
// quantity(장바구니에들어온 객체의 수량)는 1이된다.
// 그런다음 reloadCard()함수 실행
function addToCard(key){
    if(listCards[key] == null){
        listCards[key] = JSON.parse(JSON.stringify(products[key])); //products[key]값을 listCards[key]값으로 깊은 복사
        listCards[key].quantity = 1;
    }
    reloadCard();
    console.log(listCards);
}

// 담기 버튼을 눌렀을때, 실행되는 함수로서
// 장바구니 UI에 products 객체의 value값을 뿌려주는 함수
function reloadCard(){
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;
    listCards.forEach((value)=>{
        totalPrice = totalPrice + value.price;
        count = count + value.quantity;
        if(value != null){
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="${value.image}"/></div>
                <div>${value.name}</div>
                <div>${value.price.toLocaleString()}</div>
                <div>
                    <button onclick="changeQuantity(${value.id -1}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${value.id -1}, ${value.quantity + 1})">+</button>
                </div>`;
                listCard.appendChild(newDiv);
        }
    })
    total.innerText = "합계: " + totalPrice.toLocaleString();
    quantity.innerText = count;
}
// 장바구니에서 수량을 변경할때, 0이하가 되면 delete되고,
// 그렇지 않다면 합계의 값을 계산하고
// reloadCard()함수를 실행한다. <-실행하지않으면 아무일도 일어나지 않음
function changeQuantity(key, quantity){
    if(quantity == 0) {
        delete listCards[key];
    }else {
        listCards[key].quantity = quantity;
        listCards[key].price =  quantity * products[key].price;
    }
    reloadCard();
}

function filterPriceUp (){
    const filterPriceup =products
    .sort(function (a, b) {
        if(a.price < b.price)
        return -1
        if(a.price > b.price)
        return 1
        return 0;
    })
    .filter((products) => products);
}

//가격 오름차순 버튼
priceUp.addEventListener('click',function(){
    const filterPriceup =products
    .sort(function (a, b) {
        if(a.price < b.price)
        return -1
        if(a.price > b.price)
        return 1
        return 0;
    })
    .filter((products) => products);
    list.innerHTML = "";
    initApp(filterPriceup);
    console.log(products);
});

//가격 내림차순 버튼
priceDown.addEventListener('click', function(){
    products.sort(function (a, b) {
        if(a.price > b.price)
        return -1
        if(a.price < b.price)
        return 1
        return 0;
    });
    list.innerHTML = "";
    initApp(products);
    console.log(products);
});

//20,000이하 버튼
less.addEventListener('click', function(){
    const lesS = products.filter(function(a){
        return a.price <= 20000;
    });
    list.innerHTML = "";
    initApp(lesS);
    console.log(products);
});

// 초기화 버튼
reset.addEventListener('click', function(){
    listCard.innerHTML = "";
    listCards = [];
    total.innerHTML = 0;
    quantity.innerText = 0;
});

// 더보기 버튼
let count = 0;
more.addEventListener('click', function() {
    if(count === 0) {
        temp("more2.JSON");
    }else if(count === 1) {
        temp("more3.JSON");
    } else {
        alert("목록 없음");
    }
});