//initialize constants
const btnTransactionPromise = document.querySelector(
  ".btn-transaction-promise"
);
const btnTransactionAsync = document.querySelector(".btn-transaction-async");

const transactionList = document.querySelector(".transaction-list");

const searchInput = document.querySelector('.searchInput');

const arrow = document.querySelector('.arrow');

const priceArrow = document.querySelector('.priceArrow');

const dateArrow = document.querySelector('.dateArrow');
let flag = false;

//initialize api Url
const baseURL = "http://localhost:3000/transactions";


//inotialize sort value
let sortBy = 'Asc'
//calling buttons on click event
btnTransactionAsync.addEventListener("click", () => {
  getTranactionWithAsync();
});

btnTransactionPromise.addEventListener("click", () => {
  getTransactionWithPromise();
});

function getData(url) {
  return fetch(url);
}

function getTransactionWithPromise() {
  const data = getData(baseURL);
  data
    .then((res) => {
      if (!res.ok) {
        throw new Error("مشکلی در دریافت اطلاعات رخ داده است");
      }
      return res.json();
    })
    .then((transactions) => displayTransactions(transactions))
    .catch((err) => console.log(err));
}

async function getTranactionWithAsync() {
  const data = await getData(baseURL + "transactions");
  const transactions = await data.json();
  displayTransactions(transactions);
}

function displayTransactions(data) {
  let result = "";
  let row=0
  data.length &&
    data.map((item) => {
      result += `<tr>
  <td>${++row}</td>
  <td class="${item.type=='افزایش اعتبار' ? 'type-plus' : 'type-mines'}">${item.type}</td>
  <td class="price">${priceFormat(item.price)}</td>
  <td class="refId">${item.refId}</td>
  <td class="date">${changeDateFormat(item.date)}</td>
</tr>`;
    });
    transactionList.innerHTML = result;
}

function changeDateFormat(timeDate)
{
    let date = new Date(timeDate).toLocaleDateString('fa-IR');
    let time = new Date(timeDate).toLocaleTimeString('fa-IR');
    let DateTime = date + " ساعت "+time;
    return DateTime;
}

function priceFormat(price)
{
    // تبدیل عدد به رشته و اضافه کردن کاما بعد از هر سه رقم
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function sort(orderBy,sort){
   switch(orderBy)
   {
      case "Asc" :
        {
           if(sort ==="price")
              return "?_sort=price&_order=asc"
           if(sort ==="date")
              return "?_sort=date&_order=asc"
        }
        break;
      case "Desc" :
        {
            if(sort ==="price")
                return "?_sort=price&_order=desc"
            if(sort ==="date")
                return "?_sort=date&_order=desc"
        }
        break;
   }
}


// http://localhost:3000/transactions?sort=price&_order=asc

function rotateArrow(type)
{
    flag = !flag;
    type.classList.toggle('rotate')
}

priceArrow.addEventListener('click',async()=>{
    rotateArrow(priceArrow);
    let transactions;
    //if flag =true data asc else data desc
    if(flag)
    {
       const res = await getData(baseURL+sort("Asc","price"))
       transactions = await res.json()
    }
    else{
        const res = await getData(baseURL+sort("Desc","price"))
        transactions = await res.json()
    }
    displayTransactions(transactions)    
})

dateArrow.addEventListener('click',async()=>{
    rotateArrow(dateArrow);
    let transactions;
    //if flag =true data asc else data desc
    if(flag)
    {
       const res = await getData(baseURL+sort("Asc","date"))
       transactions = await res.json()
    }
    else{
        const res = await getData(baseURL+sort("Desc","date"))
        transactions = await res.json()
    }
    displayTransactions(transactions)
})


async function searchTransaction(e)
{
  let transaction;
  let res;
  if(e.target.value.trim() !='')
  {
    const qry = Number(e.target.value.trim());
    res = await getData(baseURL+`?refId_like=${qry}&${sort('Desc','price').split('?')[1]}`)
  }
  else{
    res = await getData(baseURL + `${sort("Asc","price")}`)
  }
   transaction = await res.json();
  displayTransactions(transaction);
  
}
