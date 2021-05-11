var ctx = document.getElementById('myChart').getContext('2d')
var list=document.getElementById('scroll')
let httpReq= new XMLHttpRequest()
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels:[],
        datasets:[]

    },
    options: {
        scales: {
            yAxes:[ {
                ticks:{ 
                    beginAtZero: true
                }
               
            }]
        }
    }
});
function updateChart(chart,raw){
let labels=raw.map(e=>{
    let d=new Date (e.Date)
    day=d.getDate();
    month=d.getMonth()+1;
    return `${day}/${month}`

})
let confirmed=raw.map(e=>e.Confirmed)
let recoverd=raw.map(e=>e.Recoverd)
let deaths=raw.map(e=>e.Deaths)
let active=raw.map(e=>e.Active)
let datasets=[
    {
        label:"Confirmed",
        data:confirmed,
        borderColor:"blue"
    },
    {
        label:"Recoverd",
        data:recoverd,
        borderColor: "green"
    },
    {
        label:"Deaths",
        data:deaths,
        borderColor:"red"
    },
    {
        label:"Active",
        data:active,
        borderColor:"black"
    }

]
myChart.data.labels=labels
myChart.data.datasets=datasets;
myChart.update()
}
function divClicked(e){
    httpReq.open("GET","https://api.covid19api.com/dayone/country/"+e.target.getAttribute("id"),true)
    httpReq.onreadystatechange=function(){
        if (httpReq.readyState==4 && httpReq.status==200){
            let raw =JSON.parse(httpReq.response)
            updateChart(myChart,raw);
          } 
    }
    httpReq.send()
}

httpReq.open("GET","https://api.covid19api.com/countries",true)
httpReq.onreadystatechange=function(){
    if(httpReq.readyState==4 && httpReq.status==200){
        let raw=JSON.parse(httpReq.response)
        resp=raw.sort((a,b)=>a.Country<b.Country ?-1:1)
        resp.forEach(e => {
            let d=document.createElement("div")
            d.setAttribute('id',e.ISO2)
            d.setAttribute('class',"country")
            d.innerHTML=e.Country
            d.addEventListener("click",divClicked)
            list.appendChild(d)
            
        });

    }
}
httpReq.send()

